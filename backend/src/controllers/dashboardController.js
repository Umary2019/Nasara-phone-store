import dayjs from 'dayjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Sale } from '../models/Sale.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Expense } from '../models/Expense.js';

function buildRange(start, end) {
  return { $gte: dayjs(start).startOf('day').toDate(), $lte: dayjs(end).endOf('day').toDate() };
}

export const getDashboardSummary = asyncHandler(async (_req, res) => {
  const todayRange = buildRange(dayjs(), dayjs());
  const weekRange = buildRange(dayjs().startOf('week'), dayjs());
  const monthRange = buildRange(dayjs().startOf('month'), dayjs());

  const [todaySales, weekSales, monthSales, productsCount, lowStock, customersCount, expensesMonth, recentSales, topProducts, salesChart] = await Promise.all([
    Sale.aggregate([{ $match: { createdAt: todayRange, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Sale.aggregate([{ $match: { createdAt: weekRange, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Sale.aggregate([{ $match: { createdAt: monthRange, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Product.countDocuments(),
    Product.countDocuments({ quantityInStock: { $lte: Number(process.env.LOW_STOCK_THRESHOLD || 10) } }),
    Customer.countDocuments(),
    Expense.aggregate([{ $match: { createdAt: monthRange } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Sale.find().sort({ createdAt: -1 }).limit(5).select('invoiceNumber totalAmount cashierName createdAt status'),
    Sale.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.productName', sold: { $sum: '$items.quantity' } } },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]),
    Sale.aggregate([
      { $match: { createdAt: monthRange, status: 'completed' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$totalAmount' } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  const totalProfit = await Sale.aggregate([{ $match: { createdAt: monthRange, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$profitAmount' } } }]);

  const products = await Product.find({ quantityInStock: { $lte: Number(process.env.LOW_STOCK_THRESHOLD || 10) } }).limit(5);

  res.json({
    totals: {
      salesToday: todaySales[0]?.total || 0,
      salesThisWeek: weekSales[0]?.total || 0,
      salesThisMonth: monthSales[0]?.total || 0,
      totalProducts: productsCount,
      lowStockItems: lowStock,
      totalCustomers: customersCount,
      totalProfit: totalProfit[0]?.total || 0,
      totalExpenses: expensesMonth[0]?.total || 0,
      pendingOrders: 0
    },
    recentSales,
    topProducts,
    salesChart,
    lowStockProducts: products
  });
});
