import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Sale } from '../models/Sale.js';
import { Product } from '../models/Product.js';
import { StockMovement } from '../models/StockMovement.js';
import { AuditLog } from '../models/AuditLog.js';
import { Setting } from '../models/Setting.js';

function makeInvoiceNumber() {
  return `INV-${dayjs().format('YYYYMMDD-HHmmss')}-${Math.floor(Math.random() * 900 + 100)}`;
}

export const listSales = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const query = {};

  if (req.query.search) {
    query.$or = [
      { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
      { cashierName: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const [items, total] = await Promise.all([
    Sale.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('customer cashier'),
    Sale.countDocuments(query)
  ]);

  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
});

export const getSaleById = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate('customer cashier items.product');
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' });
  }

  res.json({ item: sale });
});

export const createSale = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  const { items, customer, paymentMethod, amountPaid = 0, discountAmount = 0, taxAmount, notes = '' } = req.body;

  try {
    session.startTransaction();
    const setting = await Setting.findOne().session(session);
    const taxRate = setting?.taxRate ?? Number(process.env.TAX_RATE || 0);

    let subtotal = 0;
    let profitAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      if (!product.allowNegativeStock && product.quantityInStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.quantityInStock -= item.quantity;
      await product.save({ session });

      const lineTotal = Number(item.quantity) * Number(item.sellingPrice || product.sellingPrice) - Number(item.discount || 0);
      subtotal += lineTotal;
      profitAmount += (Number(item.sellingPrice || product.sellingPrice) - Number(product.buyingPrice)) * Number(item.quantity);

      saleItems.push({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: Number(item.quantity),
        buyingPrice: product.buyingPrice,
        sellingPrice: Number(item.sellingPrice || product.sellingPrice),
        discount: Number(item.discount || 0),
        lineTotal
      });

      await StockMovement.create([{
        product: product._id,
        movementType: 'out',
        quantity: Number(item.quantity),
        referenceType: 'sale',
        note: `Sale ${item.quantity} ${product.name}`,
        createdBy: req.user._id
      }], { session });
    }

    const calculatedTax = typeof taxAmount === 'number' ? taxAmount : subtotal * taxRate;
    const totalAmount = subtotal + calculatedTax - Number(discountAmount || 0);

    const sale = await Sale.create([{
      invoiceNumber: makeInvoiceNumber(),
      items: saleItems,
      customer,
      cashier: req.user._id,
      cashierName: req.user.fullName,
      paymentMethod,
      amountPaid: Number(amountPaid),
      subtotal,
      taxAmount: calculatedTax,
      discountAmount: Number(discountAmount || 0),
      totalAmount,
      profitAmount,
      notes
    }], { session });

    await AuditLog.create([{
      actor: req.user._id,
      actorName: req.user.fullName,
      action: 'create_sale',
      entityType: 'sale',
      entityId: sale[0]._id,
      metadata: { totalAmount, paymentMethod }
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ sale: sale[0] });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

export const voidSale = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const sale = await Sale.findById(req.params.id).session(session);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    if (sale.status === 'voided') {
      return res.status(400).json({ message: 'Sale already voided' });
    }

    for (const item of sale.items) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        product.quantityInStock += item.quantity;
        await product.save({ session });

        await StockMovement.create([{
          product: product._id,
          movementType: 'in',
          quantity: item.quantity,
          referenceType: 'void_sale',
          referenceId: sale._id,
          note: `Void sale ${sale.invoiceNumber}`,
          createdBy: req.user._id
        }], { session });
      }
    }

    sale.status = 'voided';
    await sale.save({ session });

    await AuditLog.create([{
      actor: req.user._id,
      actorName: req.user.fullName,
      action: 'void_sale',
      entityType: 'sale',
      entityId: sale._id,
      metadata: { invoiceNumber: sale.invoiceNumber }
    }], { session });

    await session.commitTransaction();
    res.json({ sale });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});
