import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                message: "Provide token",
                error: true,
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if (!decoded) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findByPk(decoded.id);
        if (!user) {
            return response.status(401).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        request.userId = user.id;
        next();

    } catch (error) {
        return response.status(500).json({
            message: "You are not logged in",
            error: error.message || error,
            success: false
        });
    }
};

export default auth;