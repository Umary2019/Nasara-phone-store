import { asyncHandler } from '../utils/asyncHandler.js';

export function createCrudController(Model, options = {}) {
  const searchFields = options.searchFields || [];
  const populate = options.populate || '';

  return {
    list: asyncHandler(async (req, res) => {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
      const skip = (page - 1) * limit;
      const query = {};

      if (req.query.search && searchFields.length) {
        query.$or = searchFields.map((field) => ({
          [field]: { $regex: req.query.search, $options: 'i' }
        }));
      }

      if (req.query.isActive !== undefined) {
        query.isActive = req.query.isActive === 'true';
      }

      const [items, total] = await Promise.all([
        Model.find(query).populate(populate).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Model.countDocuments(query)
      ]);

      res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
    }),

    getById: asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id).populate(populate);
      if (!item) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json({ item });
    }),

    create: asyncHandler(async (req, res) => {
      const item = await Model.create(req.body);
      res.status(201).json({ item });
    }),

    update: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json({ item });
    }),

    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json({ message: 'Record deleted' });
    })
  };
}
