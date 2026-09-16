import * as z from "zod";
/**
 * @param {object} req // Express.js
 * @returns {object} 
 */
export const getProductRequest = (req) =>
{
    const req_data = {
        name: req.query.name,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        minStock: req.query.minStock,
        maxStock: req.query.maxStock
    };
    const Product = z.object({
        name: z.int().optional(),
        minPrice: z.float32().optional(),
        maxPrice: z.float32().optional(),
        minStock: z.int().optional(),
        maxStock: z.int().optional()
    });

    try {
        Product.parse(req_data)
        return req_data
    } catch (error) {
        if (error instanceof z.ZodError) return error.issues;
    }
}