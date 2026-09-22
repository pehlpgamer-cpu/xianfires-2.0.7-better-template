import * as z from "zod";

/**
 * @param {object} req // Express.js
 * @returns {object}
 */
export const updateProductRequest = (req) => {
  const req_data = {
    id: req.param.id,
    name: req.body.name.trim(),
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
  };

  const Product = z.object({
    id: z.int(),
    name: z.string().min(8).max(64),
    description: z.string().max(512).optional(),
    price: z.float32(),
    stock: z.int(),
  });

  try {
    Product.parse(req_data);
    return req_data;
  } catch (error) {
    if (error instanceof z.ZodError) return error.issues;
  }
};
