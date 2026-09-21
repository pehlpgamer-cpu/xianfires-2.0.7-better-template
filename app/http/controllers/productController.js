
import { storeProductRequest } from "../requests/product/storeProductRequest.js"
import { updateProductRequest } from "../requests/product/updateProductRequest.js"
import { getProductRequest } from "../requests/product/getProductRequest.js"
import { singleResourceRequest } from "../requests/singleResourceRequest.js";

import { Product } from "../../models/Product.js";
export const productController = {
  show: async (req, res) => {
    const validated = singleResourceRequest(req)
    
  },

  index: async (req, res) => {
    const validated = getProductRequest(req)
    //const products = await Product.findAll()
    res.render("product", 
      { 
        pageTitle: "Products!!!",
        user: { 
          isAdmin: true
        },
        products: [
          {
            name: "EcoFlow Pro River 2 - 409wh",
            price: 28000.00
          },
          {
            name: "Acer nitro V 15.5 inch",
            price: 36000.00
          },
          {
            name: "Atomic Habits",
            price: 599.00
          },
          {
            name: "Product 12893",
            price: 59329.00
          },
          {
            name: "Product 12893",
            price: 59329.00
          },
          {
            name: "Product 93",
            price: 9999.00
          },
          {
            name: "Product 10003",
            price: 59.00
          }
        ]
      }
    )
  },

  store: async (req, res) => {
    const validated = storeProductRequest(req)
    const product = await Product.create({
      name: validated.name,
      description: validated.description,
      price: validated.price,
      stock: validated.stock
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
