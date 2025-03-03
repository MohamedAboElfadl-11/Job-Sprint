import UserModel from "../../../DB/Models/users.model.js";

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
    const user = await UserModel.findById(userId).select('firstName lastName phone')
    if (!user) return res.status(404).json({ message: "user not found" })
    res.status(200).json({ user })
}

// update password
export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPasswoed } = req.body
    const user = await UserModel.findById(req.loginUser._id)
    if (!user) return res.status(400).json({ message: "user not found" })
    const isMatched = await user.comparePassword(oldPassword)
    if (!isMatched) return res.status(400).json({ message: "password not matched" })
    user.password = newPassword 
    await user.save()
    res.status(200).json({ message: 'password updated successfully' })
}