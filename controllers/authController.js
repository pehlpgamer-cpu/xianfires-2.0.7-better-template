import * as argon2 from "argon2";
import { v4 as uuidv4 } from 'uuid';
import { argon2Config } from "../configs/argon2Config.js"
import { User, sequelize } from "../models/userModel.js";
import { loginRequest } from "../requests/auth/loginRequest.js"
import { registerRequest } from "../requests/auth/loginRequest.js"
await sequelize.sync();

export const authController = {
  loginView: (req, res) => res.render("login", { title: "Login" }),
  registerView: (req, res) => res.render("register", { title: "Register" }),
  forgotPasswordView: (req, res) => res.render("forgotpassword", { title: "Forgot Password" }),

  dashboardView: (req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    res.render("dashboard", { title: "Dashboard" });
  },

  login: async (req, res) => {
    const { email } = loginRequest(req)

    const user = await User.findOne({ where: { email } });
    if (!user) return res.send("User not found");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Incorrect password");

    req.session.userId = user.id;
    res.redirect("/dashboard");
  },

  register: async (req, res) => {
    const validData = registerRequest(req)

    const salt = uuidv4()
    const pepper = process.env.APP_SECRET
    const hashPassword = await argon2.hash(password + salt + pepper, argon2Config);

    const user = await User.create({ 
      name: validData.name, 
      email: validData.email, 
      password: hashPassword,
      salt: salt
    });
    req.session.userId = user.id;
    res.redirect("/dashboard");
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  },
};
