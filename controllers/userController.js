import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ message: "User already exists", user: user });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200)
            .cookie("token", token, { expiresIn: "1d", httpOnly: true })
            .json({ message: "User logged in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const Logout = (req, res) => {
    res.clearCookie("token").json({ message: "User logged out successfully" });
};

export const Profile = async (req, res) => {
    try {
        res.status(200).json("User profile");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const orderProduct = async (req, res) => {
    try {
        const { email, orderDetail } = req.body;

        if (!email || !orderDetail) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields" });
        }

        const user = await User.findOne({ email });
        user.orderDetails.push(orderDetail);

        res.status(200).json("Product ordered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getAllOrderDetails = async (req, res) => { 
    try {
        const admin = process.env.ADMIN_ID;
        const { id } = req.params;
        if(admin === id) {
            const allOrderDetails = await User.find({}, "orderDetails");
            res.status(200).json(allOrderDetails);
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateStageOfOrderDetails = async (req, res) => {
    try {
        const admin = process.env.ADMIN_ID;
        const { id } = req.params;
        const { orderDetails } = req.body;
        if(admin === id) {
            const allOrderDetails = await User.find({}, "orderDetails");
            allOrderDetails.forEach(async (user) => {
                user.orderDetails.forEach(async (order) => {
                    if(order.orderId === orderDetails.orderId) {
                        order.stage = orderDetails.stage;
                        await user.save();
                    }
                });
            });
            res.status(200).json("Order details updated successfully");
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
