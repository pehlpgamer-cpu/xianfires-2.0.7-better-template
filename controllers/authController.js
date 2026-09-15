
    
import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";
await sequelize.sync();

export const authController =
{
  loginView: (req, res) => res.render("login", { title: "Login" }),
  registerView: (req, res) => res.render("register", { title: "Register" }),
  forgotPasswordView: (req, res) => res.render("forgotpassword", { title: "Forgot Password" }),

  dashboardView: (req, res) => 
  {
    if (!req.session.userId) return res.redirect("/login");
    res.render("dashboard", { title: "Dashboard" });
  },
  
  loginUser: async (req, res) => 
  { 
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    const Login = z.object({ 
      email: z.string(),
      password: z.string()
    });

    try {
      Player.parse({ username: 42, xp: "100" });
    } 
    catch(error) {
      if(error instanceof z.ZodError)
      {
        res.json(error.issues)
      }
    }
  },
  
  registerUser: async (req, res) => 
  {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    req.session.userId = user.id;
    res.redirect("/dashboard");
  },
  
  logoutUser: (req, res) => 
  {
    req.session.destroy();
    res.redirect("/login");
  },
}

