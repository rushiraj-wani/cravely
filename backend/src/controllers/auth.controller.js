import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;

  const isUserExists = await userModel.findOne({
    email,
  });

  if (isUserExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully!",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}
export default { registerUser };
