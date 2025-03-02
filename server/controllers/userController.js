import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import UserModel from "../models/user.model.js";

const generateAccessToken = (id) => jwt.sign({ id }, process.env.SECRET_KEY_ACCESS_TOKEN, { expiresIn: "1h" });
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.SECRET_KEY_REFRESH_TOKEN, { expiresIn: "7d" });

export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required." });

        const existingUser = await UserModel.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await UserModel.create({ name, email, password: hashedPassword });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser.id}`;
        await sendEmail({ sendTo: email, subject: "Verify Your Email", html: verifyEmailTemplate({ name, url: verifyUrl }) });


        res.json({ message: "User registered successfully. Check your email to verify your account.", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required." });

        const user = await UserModel.findOne({ where: { email } });
        if (!user || !await bcryptjs.compare(password, user.password)) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "None" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "None" });

        res.json({ message: "Login successful", accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function logoutController(req, res) {
    try {
        const userId = req.userId;
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        await UserModel.update({ refresh_token: "" }, { where: { id: userId } });

        res.json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
