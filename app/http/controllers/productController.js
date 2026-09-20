
import { storeProductRequest } from "../requests/product/storeProductRequest.js"
import { updateProductRequest } from "../requests/product/updateProductRequest.js"
import { getProductRequest } from "../requests/product/getProductRequest.js"
import { singleResourceRequest } from "../requests/singleResourceRequest.js";

import { Product } from "../../models/Product.js";
export const productController = {
  show: async (req, res) => {
    const validData = singleResourceRequest(req)
    
  },

  index: (req, res) => {
    const result = getProductRequest(req)
    res.json(result)
  },

  store: async (req, res) => {
    const data = storeProductRequest(req)
    const product = Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock
    })
    res.json({id: product.id}).status(201)
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
