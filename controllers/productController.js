import * as z from "zod";

export const productController = {
  show: async (req, res) => {
    const req_data = {
      id: req.params.id,
    };
    const Product = z.object({
      id: z.int(),
    });

    try {
      Product.parse(req_data);
    } catch (error) {
      if (error instanceof z.ZodError) res.json(error.issues);
    }
  },

  index: (req, res) => {
    res.send("product index");
  },

  store: async (req, res) => {},

  create: async (req, res) => {},
};
