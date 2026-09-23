import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { argon2Config } from "../../../config/cryptography.js";
import User from "../../models/User.js";
import { loginRequest } from "../requests/auth/loginRequest.js";
import { registerRequest } from "../requests/auth/registerRequest.js";

export default {
  loginPage: (_req, res) => res.render("auth/login", { pageTitle: "Login" }),
  registerPage: (_req, res) => res.render("auth/register", { pageTitle: "Register" }),
  forgotPasswordPage: (_req, res) =>
    res.render("auth/forgotpassword", { pageTitle: "Forgot Password" }),

  dashboardPage: (req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    res.render("dashboard", { pageTitle: "Dashboard" });
  },

  login: async (req, res) => {
    const { email, password } = loginRequest(req);

    const user = await User.findOne({ where: { email } });
    if (!user) return res.send("User not found");
    //const match = await argon2.compare(password, user.password);
    if (!match) {
      return res.send("Incorrect password");
    }

    req.session.userId = user.id;
    res.redirect("/dashboard");
  },

  register: async (req, res) => {
    const validData = registerRequest(req);

    const salt = uuidv4();
    const pepper = process.env.SECRET_KEY;
    const hashPassword = await argon2.hash(password + salt + pepper, argon2Config);

    const user = await User.create({
      name: validData.name,
      email: validData.email,
      password: hashPassword,
      salt: salt,
    });
    req.session.userId = user.id;
    res.redirect("/dashboard");
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  },
};
