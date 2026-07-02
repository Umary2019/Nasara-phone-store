import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import dayjs from 'dayjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Sale } from '../models/Sale.js';
import { Product } from '../models/Product.js';
import { Expense } from '../models/Expense.js';

async function writePdfReport(res, title, rows) {
  const doc = new PDFDocument({ margin: 36 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
  doc.pipe(res);
  doc.fontSize(18).text(title);
  doc.moveDown();
  rows.forEach((row) => {
    doc.fontSize(10).text(row);
  });
  doc.end();
}

async function writeExcelReport(res, title, columns, rows) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);
  worksheet.columns = columns;
  worksheet.addRows(rows);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '-').toLowerCase()}.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
}

export const exportSalesReport = asyncHandler(async (req, res) => {
  const sales = await Sale.find().sort({ createdAt: -1 }).limit(500);
  const rows = sales.map((sale) => ({
    invoiceNumber: sale.invoiceNumber,
    cashierName: sale.cashierName,
    totalAmount: sale.totalAmount,
    status: sale.status,
    createdAt: dayjs(sale.createdAt).format('YYYY-MM-DD HH:mm')
  }));

  if (req.query.format === 'pdf') {
    return writePdfReport(res, 'Sales Report', rows.map((row) => `${row.invoiceNumber} | ${row.cashierName} | ${row.totalAmount} | ${row.status} | ${row.createdAt}`));
  }

  return writeExcelReport(res, 'Sales Report', [
    { header: 'Invoice Number', key: 'invoiceNumber', width: 24 },
    { header: 'Cashier', key: 'cashierName', width: 20 },
    { header: 'Total', key: 'totalAmount', width: 12 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Created At', key: 'createdAt', width: 18 }
  ], rows);
});

export const exportInventoryReport = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('category supplier');
  const rows = products.map((product) => ({
    name: product.name,
    sku: product.sku,
    quantityInStock: product.quantityInStock,
    buyingPrice: product.buyingPrice,
    sellingPrice: product.sellingPrice
  }));

  if (req.query.format === 'pdf') {
    return writePdfReport(res, 'Inventory Report', rows.map((row) => `${row.name} | ${row.sku} | ${row.quantityInStock} | ${row.buyingPrice} | ${row.sellingPrice}`));
  }

  return writeExcelReport(res, 'Inventory Report', [
    { header: 'Name', key: 'name', width: 26 },
    { header: 'SKU', key: 'sku', width: 18 },
    { header: 'Qty', key: 'quantityInStock', width: 10 },
    { header: 'Buying', key: 'buyingPrice', width: 12 },
    { header: 'Selling', key: 'sellingPrice', width: 12 }
  ], rows);
});

export const exportExpenseReport = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  const rows = expenses.map((expense) => ({
    category: expense.category,
    amount: expense.amount,
    expenseDate: dayjs(expense.expenseDate).format('YYYY-MM-DD'),
    notes: expense.notes
  }));

  if (req.query.format === 'pdf') {
    return writePdfReport(res, 'Expense Report', rows.map((row) => `${row.category} | ${row.amount} | ${row.expenseDate} | ${row.notes}`));
  }

  return writeExcelReport(res, 'Expense Report', [
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 12 },
    { header: 'Expense Date', key: 'expenseDate', width: 16 },
    { header: 'Notes', key: 'notes', width: 30 }
  ], rows);
});
