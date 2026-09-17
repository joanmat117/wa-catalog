import { z } from 'astro/zod';

// Read allowed currencies from environment variable
const RAW = import.meta.env.PUBLIC_ALLOWED_CURRENCIES ?? '';
const ALLOWED_CURRENCIES = RAW
  ? RAW.split(',').map((c: string) => c.trim()).filter((c: string): boolean => c.length > 0)
  : ['CUP'];
const DEFAULT_CURRENCY = ALLOWED_CURRENCIES[0];

export const productSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),

  price: z.number().positive('Price must be a positive number'),
  currency: z.enum(ALLOWED_CURRENCIES as [string, ...string[]]).default(DEFAULT_CURRENCY),

  images: z.array(z.string('Each image must be a valid URL')).default([]),
  categories: z.array(z.string().min(1, 'Category cannot be empty')).min(1),

  vip: z.boolean().default(false),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
});
