import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Purchase } from '../models/Purchase.js';
import { Product } from '../models/Product.js';
import { StockMovement } from '../models/StockMovement.js';
import { AuditLog } from '../models/AuditLog.js';

function makeReferenceNumber() {
  return `PO-${dayjs().format('YYYYMMDD-HHmmss')}-${Math.floor(Math.random() * 900 + 100)}`;
}

export const listPurchases = asyncHandler(async (req, res) => {
  const items = await Purchase.find().sort({ createdAt: -1 }).populate('supplier recordedBy items.product');
  res.json({ items });
});

export const createPurchase = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  const { supplier, items, notes = '' } = req.body;

  try {
    session.startTransaction();
    let totalCost = 0;
    const purchaseItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      product.quantityInStock += Number(item.quantity);
      product.buyingPrice = Number(item.costPrice || product.buyingPrice);
      await product.save({ session });

      totalCost += Number(item.quantity) * Number(item.costPrice);
      purchaseItems.push({
        product: product._id,
        productName: product.name,
        quantity: Number(item.quantity),
        costPrice: Number(item.costPrice)
      });

      await StockMovement.create([{
        product: product._id,
        movementType: 'in',
        quantity: Number(item.quantity),
        referenceType: 'purchase',
        note: `Stock in from purchase for ${product.name}`,
        createdBy: req.user._id
      }], { session });
    }

    const purchase = await Purchase.create([{
      referenceNumber: makeReferenceNumber(),
      supplier,
      recordedBy: req.user._id,
      items: purchaseItems,
      totalCost,
      notes
    }], { session });

    await AuditLog.create([{
      actor: req.user._id,
      actorName: req.user.fullName,
      action: 'create_purchase',
      entityType: 'purchase',
      entityId: purchase[0]._id,
      metadata: { totalCost }
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ purchase: purchase[0] });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});
