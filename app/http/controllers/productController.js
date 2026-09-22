import { storeProductRequest } from "../requests/product/storeProductRequest.js";
import { updateProductRequest } from "../requests/product/updateProductRequest.js";
import { getProductRequest } from "../requests/product/getProductRequest.js";
import { singleResourceRequest } from "../requests/singleResourceRequest.js";

import { Product } from "../../models/Product.js";
export const productController = {
  show: async (req, res) => {
    const validated = singleResourceRequest(req);
  },

  index: async (req, res) => {
    const validated = getProductRequest(req);
    const products = await Product.findAll();
    console.log(JSON.stringify(products));
    res.render("product", {
      pageTitle: "Products!!!",
      user: {
        isAdmin: true,
      },
      products: products,
    });
  },

  store: async (req, res) => {
    const validated = storeProductRequest(req);
    const product = await Product.create({
      name: validated.name,
      description: validated.description,
      price: validated.price,
      stock: validated.stock,
    });
    res.json({ id: product.id }).status(201);
  },

  //view
  create: async (req, res) => {
    // res.render("create_product")
  },

  update: async (req, res) => {
    const result = updateProductRequest(req);
  },

  //view
  edit: async (req, res) => {
    // res.render("edit_product")
  },

  replace: async (req, res) => {},
};
