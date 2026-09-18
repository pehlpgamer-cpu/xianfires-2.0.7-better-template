import * as z from "zod";
import { storeProductRequest } from "../requests/product/storeProductRequest.js"
import { updateProductRequest } from "../requests/product/updateProductRequest.js"
import { getProductRequest } from "../requests/product/getProductRequest.js"
export const productController = {
  show: async (req, res) => {
    const Product = z.object({id: z.int()});
    try {
      Product.parse({id: req.params.id});

      res.json({}).status(200)
    } catch (error) {
      if (error instanceof z.ZodError) res.json(error.issues).status(404);
    }
  },

  index: (req, res) => {
    const result = getProductRequest(req)
    res.json(result)
  },

  store: async (req, res) => {
    const result = storeProductRequest(req)
    res.json(result)
  },

  //view
  create: async (req, res) => {
    // res.render("create_product")
  },

  update: async (req, res) => {
    const result = updateProductRequest(req)
  },

  //view
  edit: async (req, res) => {
    // res.render("edit_product")
  },

  replace: async (req, res) => {
    
  },
};
