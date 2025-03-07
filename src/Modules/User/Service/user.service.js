import { cloudinary } from "../../../Config/cloudinary.config.js";
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

// Upload Profile Pic
export const uploadProfilePicService = async (req, res) => {
    const { _id, profilePic } = req.user
    const { file } = req
    if (!file) return res.status(400).json({ message: 'Profile picture required' })
    if (profilePic && profilePic.secure_url) await cloudinary().uploader.destroy(profilePic.public_id)
    const { secure_url, public_id } = await cloudinary().uploader.upload(
        file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Users/Profile`,
            resource_type: 'image'
        }
    )
    await UserModel.findByIdAndUpdate(_id, { profilePic: { secure_url, public_id } }, { new: true })
    res.status(200).json({ message: 'User profile picture uploaded successfully' })
}

// Upload Cover Pic
export const uploadCoverPicService = async (req, res) => {
    const { _id, coverPic } = req.user
    const { file } = req
    if (!file) return res.status(400).json({ message: 'Cover picture required' })
    if (coverPic && coverPic.secure_url) await cloudinary().uploader.destroy(coverPic.public_id)
    const { secure_url, public_id } = await cloudinary().uploader.upload(
        file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Users/Cover`,
            resource_type: 'image'
        }
    )
    await UserModel.findByIdAndUpdate(_id, { coverPic: { secure_url, public_id } }, { new: true })
    res.status(200).json({ message: 'User cover picture uploaded successfully' })
}

// Delete Profile Pic
export const deleteProfilePicService = async (req, res) => {
    const { _id, profilePic } = req.user
    if (!profilePic.secure_url) return res.status(400).json({ message: 'User profile pic already deleted' })
    const user = await UserModel.findByIdAndUpdate(_id, { $unset: { profilePic: '' } })
    const ProfilePicPublic_Id = user.profilePic.public_id
    await cloudinary().uploader.destroy(ProfilePicPublic_Id)
    res.status(200).json({ message: 'User profile picture deleted successfully' })
}

// Delete Cover Pic
export const deleteCoverPicService = async (req, res) => {
    const { _id, coverPic } = req.user
    if (!coverPic.secure_url) return res.status(400).json({ message: 'User cover pic already deleted' })
    const user = await UserModel.findByIdAndUpdate(_id, { $unset: { coverPic: '' } })
    const coverPicPublic_Id = user.coverPic.public_id
    await cloudinary().uploader.destroy(coverPicPublic_Id)
    res.status(200).json({ message: 'User cover pic deleted successfully' })
}

// soft delete account
export const deleteAccount = async (req, res) => {
    req.user.deletedAt = new Date();
    await req.user.save()
    res.status(200).json({ message: 'Account deleted successfully' })
}