import UserModel from "../../../DB/Models/users.model.js";
import { comparing, hashing } from "../../../Utils/crypto.utils.js";

// update account service
export const updateUserAccountService = async (req, res) => {
    const user = await UserModel.findById(req.loginUser._id)
    if (!user) return res.status(404).json({ message: "User not found" });
    const { phone, DOB, firstName, lastName, gender } = req.body;
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (gender) user.gender = gender
    if (DOB) user.DOB = DOB
    if (phone) user.phone = phone;
    await user.save()
    res.status(201).json({ message: "Your Data updated successfully" })
}

// get user login data
export const userData = async (req, res) => {
    const user = req.loginUser
    await UserModel.findById(user._id)
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User data", user });
}

// get profile data for another user
export const profileData = async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).select('firstName lastName phone deletedAt')
    if (!user || user.deletedAt <= new Date()) return res.status(404).json({ message: "user not found" })
    res.status(200).json({ user })
}

// update password
export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPasswoed } = req.body
    const user = await UserModel.findById(req.loginUser._id)
    if (!user) return res.status(400).json({ message: "user not found" })
    const isMatched = comparing(oldPassword, user.password)
    if (!isMatched) return res.status(400).json({ message: "wrong password" })
    const hashedPassword = hashing(newPassword, +process.env.SALT)
    user.password = hashedPassword
    await user.save()
    res.status(200).json({ message: 'password updated successfully' })
}

// soft delete account
export const deleteAccount = async (req, res) => {
    req.user.deletedAt = new Date();
    await req.user.save()
    res.status(200).json({ message: 'Account deleted successfully' })
}