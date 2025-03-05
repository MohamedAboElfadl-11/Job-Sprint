import UserModel from "../../../DB/Models/users.model.js";
import { comparing, hashing } from "../../../Utils/crypto.utils.js";

// update account service
export const updateUserAccountService = async (req, res) => {
    const { phone, DOB, firstName, lastName, gender, role } = req.body;
    if (firstName) req.user.firstName = firstName
    if (lastName) req.user.lastName = lastName
    if (gender) req.user.gender = gender
    if (DOB) req.user.DOB = DOB
    if (phone) req.user.phone = phone;
    if (role) req.user.role = role
    await req.user.save()
    res.status(201).json({ message: "Your Data updated successfully" })
}

// get user login data
export const userData = async (req, res) => {
    res.status(200).json({ message: "User data", user: req.user });
}

// get profile data for another user
export const profileData = async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findOne({ _id: userId }).select('firstName lastName phone deletedAt')
    if (!user || user.deletedAt <= new Date()) return res.status(404).json({ message: "user not found" })
    res.status(200).json({ user })
}

// update password
export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPasswoed } = req.body
    const isMatched = comparing(oldPassword, req.user.password)
    if (!isMatched) return res.status(400).json({ message: "wrong password" })
    req.user.password = newPassword
    req.user.changeCredentialTime = new Date()
    await req.user.save()
    res.status(200).json({ message: 'password updated successfully' })
}

// soft delete account
export const deleteAccount = async (req, res) => {
    req.user.deletedAt = new Date();
    await req.user.save()
    res.status(200).json({ message: 'Account deleted successfully' })
}