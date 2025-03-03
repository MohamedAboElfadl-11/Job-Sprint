import UserModel from "../../../DB/Models/users.model.js";

// update account service
export const updateUserAccountService = async (req, res) => {
    const user = await UserModel.findById(req.loginUser._id);
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