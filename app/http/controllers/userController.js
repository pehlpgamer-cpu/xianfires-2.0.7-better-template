import storeUserRequest from "../requests/user/storeUserRequest.js";
import updateUserRequest from "../requests/user/updateUserRequest.js";
import getUserRequest from "../requests/user/getUserRequest.js";
import singleResourceRequest from "../requests/singleResourceRequest.js";

import User from "../../models/User.js";
export default {
  show: async (req, res) => {
    const validated = singleResourceRequest(req);
  },

  index: async (req, res) => {
    const validated = getUserRequest(req);

    const users = [
      {
        id: 1,
        username: "paulo",
        email: "email.com",
        role: "admin"
      },
      {
        id: 12,
        username: "bro",
        email: "bro_mail.com",
        role: "guest"
      },
      {
        id: 321,
        username: "chad",
        email: "gigachad_mail.com",
        role: "admin"
      },
      {
        id: 1123,
        username: "test",
        email: "test_email.com",
        role: "guest"
      }
    ]
    //const users = await User.findAll();

    res.render("users", {
      pageTitle: "Users!!!",
      layout: "main",
      users: users,
    });
  },

  store: async (req, res) => {
    const validated = storeUserRequest(req);
    // const User = await User.create({
    //   //...
    // });
    res.json({ id: product.id }).status(201);
  },

  update: async (req, res) => {
    const validated = updateUserRequest(req);
  },
  replace: async (req, res) => {},

  destroy: async (req, res) => {},

  //page
  create: async (req, res) => {
    // res.render("create_product")
  },
  //page
  edit: async (req, res) => {
    // res.render("edit_product")
  },
};
