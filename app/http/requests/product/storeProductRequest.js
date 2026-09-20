import * as z from "zod";
/**
 * @param {object} req // Express.js
 * @returns {object} 
 */
export const storeProductRequest = (req) =>
{
    const data = {
        name: req.body.name.trim(),
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock
    };
    const Product = z.object({
        name: z.string().min(8).max(64),
        description: z.string().max(512).optional(),
        price: z.float32(),
        stock: z.int()
    });

    try {
        Product.parse(data);
        return data;
    } catch (error) {
        if (error instanceof z.ZodError) return error.issues;
    }
}