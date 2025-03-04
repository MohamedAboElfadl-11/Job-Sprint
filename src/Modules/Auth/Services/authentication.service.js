import { DateTime } from "luxon";
import UserModel from "../../../DB/Models/users.model.js";
import { emitter } from "../../../Services/sendEmail.service.js";
import emailTemplate from "../../../Utils/emailTemplet.utils.js";
import * as secure from "../../../Utils/crypto.utils.js";
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from "uuid";
import BlackListTokensModel from "../../../DB/Models/blackedListTokens.model.js";

// Signup service
export const signUpService = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, gender, DOB, phone, role } = req.body;
    const isEmailExist = await UserModel.findOne({ email })
    if (isEmailExist) return res.status(400).json({ message: "email already exist" })
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = secure.hashing(otp, +process.env.SALT)
    const otpExpiration = DateTime.now().plus({ minutes: 10 }).toJSDate();
    emitter.emit('sendEmail', {
        subject: "Your OTP code",
        to: email,
        html: emailTemplate(firstName, otp, 'verify your account')
    })
    const birthDay = DateTime.fromISO(DOB).toJSDate();
    const user = new UserModel({
        firstName, lastName, email, password, phone, gender, role, DOB: birthDay,
        otp: [{ code: hashedOtp, type: "confirmEmail", expiresIn: otpExpiration }]
    })
    await user.save()
    res.status(201).json({ message: "Account created successfully" })
}

// verify account service
export const verifyAccountService = async (req, res) => {
    const { otp, email } = req.body;
    const user = await UserModel.findOne({ email, isConfirmed: false, "otp.type": "confirmEmail" });
    if (!user) return res.status(400).json({ message: "user not found" });
    const otpEntry = user.otp.find(entry => entry.type === "confirmEmail");
    if (!otpEntry || DateTime.now() > otpEntry.expiresIn) {
        return res.status(400).json({ message: "OTP has expired" });
    }
    const isOtpValid = await secure.comparing(otp.toString(), otpEntry.code);
    if (!isOtpValid) {
        return res.status(401).json({ message: "Invalid OTP" });
    }
    await UserModel.findByIdAndUpdate(user._id, {
        isConfirmed: true, $pull: { otp: { type: "confirmEmail" } }
    });
    res.status(200).json({ message: "email verified successfully" });
}

// login service
export const loginService = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(401).json({ message: "invalied email or password" })
    const userPassword = await secure.comparing(password, user.password)
    if (!userPassword) return res.status(401).json({ message: "invalied email or password" })
    const accesstoken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h', jwtid: uuidv4() })
    const refreshtoken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d', jwtid: uuidv4() })
    res.status(200).json({ message: "Login successfully", accesstoken, refreshtoken });
}

// refresh token services 
export const refreshTokenService = async (req, res) => {
    const { refreshtoken } = req.headers;
    const decodedRefreshToken = jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN)
    const isRefreshTokenBlacklisted = await BlackListTokensModel.findOne({ tokenId: decodedRefreshToken.jti });
    if (isRefreshTokenBlacklisted) return res.status(400).json({ message: "Token already blacklisted" })
    const accesstoken = jwt.sign({ _id: decodedRefreshToken._id, email: decodedRefreshToken.email }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h', jwtid: uuidv4() })
    res.status(200).json({ message: "Token refershed successfully", accesstoken });
}

// logout service
export const logoutService = async (req, res) => {
    const { tokenId, expiryDate } = req.loginUser.token;
    const { refreshtoken } = req.headers
    const decodedRefreshToken = jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN)
    const existingTokens = await BlackListTokensModel.find({
        tokenId: { $in: [tokenId, decodedRefreshToken.jti] }
    });
    if (existingTokens.length > 0) {
        return res.status(400).json({ message: "Token already blacklisted" });
    }
    await BlackListTokensModel.insertMany([
        { tokenId, expiryDate }, { tokenId: decodedRefreshToken.jti, expiryDate: decodedRefreshToken.exp }
    ]);
    res.status(200).json({ message: "User logged out successfully" });
}

// forget password service
export const forgetPasswordService = async (req, res) => {
    const { email } = req.body
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = secure.hashing(otp, +process.env.SALT)
    const otpExpiration = DateTime.now().plus({ minutes: 10 }).toJSDate();
    emitter.emit('sendEmail', {
        subject: "Your OTP code",
        to: email,
        html: emailTemplate(user.firstName, otp, 'reset your password')
    })
    await UserModel.findByIdAndUpdate(user._id, {
        otp: [{ code: hashedOtp, type: "forgetPassword", expiresIn: otpExpiration }]
    })
    res.status(202).json({ message: "OTP sented successfully, check yor email inbox" })
}

// reset password service
export const resetPasswordService = async (req, res) => {
    const { email, otp, password, confirmPassword } = req.body;
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(400).json({ message: "user not found" });
    const otpEntry = user.otp.find(entry => entry.type === "forgetPassword");
    if (!otpEntry || DateTime.now() > otpEntry.expiresIn) {
        return res.status(400).json({ message: "OTP has expired" });
    }
    const isOtpValid = await secure.comparing(otp.toString(), otpEntry.code);
    if (!isOtpValid) {
        return res.status(401).json({ message: "Invalid OTP" });
    }
    const hashedPassword = await secure.hashing(password, +process.env.SALT)
    await UserModel.findByIdAndUpdate(user._id, {
        password: hashedPassword, $pull: { otp: { type: "forgetPassword" } }
    });
    res.status(200).json({ message: "password reset successfully" });
}