import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        const error = new ApiError(400, 'Validation failed', errors);
        next(error);
      } else {
        next(error);
      }
    }
  };
};

export const schemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),

  createListing: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      category: z.enum(['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market']),
      location: z.object({
        city: z.string().min(1, 'City is required'),
        area: z.string().min(1, 'Area is required'),
      }),
      shortDescription: z.string().min(1, 'Short description is required').max(200),
      description: z.string().min(1, 'Description is required'),
      phone: z.string().min(1, 'Phone is required'),
      hours: z.string().optional(),
      imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
    }),
  }),

  updateListing: z.object({
    body: z.object({
      name: z.string().min(1).optional(),
      category: z.enum(['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market']).optional(),
      location: z
        .object({
          city: z.string().min(1),
          area: z.string().min(1),
        })
        .optional(),
      shortDescription: z.string().min(1).max(200).optional(),
      description: z.string().min(1).optional(),
      phone: z.string().min(1).optional(),
      hours: z.string().optional(),
      imageUrl: z.string().url().optional().or(z.literal('')),
      isActive: z.boolean().optional(),
    }),
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid listing ID'),
    }),
  }),

  getListings: z.object({
    query: z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      sort: z.enum(['newest', 'az']).optional(),
      page: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
    }),
  }),
};
