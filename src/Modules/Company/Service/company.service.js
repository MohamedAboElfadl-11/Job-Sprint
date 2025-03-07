import { cloudinary } from "../../../Config/cloudinary.config.js"
import CompanyModel from "../../../DB/Models/company.model.js"
import UserModel from "../../../DB/Models/users.model.js"

// create company service
export const addCompanyService = async (req, res) => {
    const { _id } = req.user
    const { file } = req
    const { companyName, description, industry, address, numberOfEmployees, companyEmail, CreatedBy, HRs, } = req.body
    const isCompanyEmailExist = await CompanyModel.findOne({ companyEmail })
    if (isCompanyEmailExist) return res.status(409).json({ message: "company email already exist" })
    const isCompanyNameExist = await CompanyModel.findOne({ companyName })
    if (isCompanyNameExist) return res.status(409).json({ message: "company name already exist" })
    const companyData = {
        companyName, companyEmail, description, industry, address, numberOfEmployees,
        CreatedBy: _id
    }
    if (HRs) {
        if (typeof (HRs) === 'string') HRs = [HRs]
        const users = await UserModel.find({ _id: { $in: HRs } })
        if (users.length !== HRs.length) return res.status(409).json({ message: 'invalid hrs ids' })
        companyData.HRs = HRs
    }
    if (file) {
        const { secure_url, public_id } = await cloudinary().uploader.upload(
            file.path,
            {
                folder: `${process.env.CLOUDINARY_FOLDER}/Company/legalAttachment`
            }
        )
        companyData.legalAttachment = { secure_url, public_id }
    }
    await CompanyModel.create(companyData)
    res.status(200).json({ message: "Company created successfully" })
}

// update company service
export const updateCompanyService = async (req, res) => {
    const { companyId } = req.params
    const userId = req.user._id.toString()
    const { companyEmail, companyName, description, industry, address, numberOfEmployees, HRs } = req.body

    const company = await CompanyModel.findOne({ _id: companyId, bannedAt: { $exists: false }, deletedAt: { $exists: false } });
    if (!company) return res.status(404).json({ message: 'Company not found or banned' });

    if (company.CreatedBy.toString() !== userId)
        return res.status(401).json({ message: "Unauthorized" })

    const existingCompany = await CompanyModel.findOne({
        _id: { $ne: companyId },
        $or: [{ companyName }, { companyEmail }]
    });
    if (existingCompany) return res.status(409).json({ message: "Company name or email already exists" });
    if (description) company.description = description
    if (industry) company.industry = industry
    if (address) company.address = address
    if (numberOfEmployees) company.numberOfEmployees = numberOfEmployees
    if (HRs) {
        const users = await UserModel.find({ _id: { $in: HRs } })
        if (users.length !== HRs.length) return res.status(409).json({ message: 'invalid hrs ids' })
        company.HRs = HRs
    }

    await company.save()
    res.status(200).json({ message: "data updated successfully" })
}

// soft delete company 
export const deleteCompanyService = async (req, res) => {
    const { companyId } = req.params;
    const user = req.user._id.toString()
    const userRole = req.user.role;
    const company = await CompanyModel.findById(companyId)
    if (!company) return res.status(404).json({ message: "company not found" })
    if (userRole !== 'admin' && company.CreatedBy.toString() !== user)
        return res.status(401).json({ message: "Unauthorized" })
    if (company.deletedAt) return res.status(409).json({ message: "company already deleted" })
    company.deletedAt = new Date();
    await company.save()
    res.status(200).json({ message: "company deleted successfully" })
}

export const getCompanyWithJob = async (req, res) => {
    const { companyId } = req.params;
    const company = await CompanyModel.findOne({
        _id: companyId, bannedAt: { $exists: false }, deletedAt: { $exists: false }
    }).populate("jobs")
    if (!company) return res.status(404).json({ message: "Company not found or deleted" });
    res.status(200).json({ company });
}

// search company by name
export const searchCompanyByNameSevice = async (req, res) => {
    const { companyName } = req.query
    const company = await CompanyModel.findOne({
        companyName: { $regex: `^${companyName}`, $options: "i" },
        bannedAt: { $exists: false }, deletedAt: { $exists: false }
    }).select('-__v')
    if (!company) return res.status(404).json({ message: "company not found" })
    res.status(200).json({ company })
}

// Upload company logo
export const uploadCompanyLogoService = async (req, res) => {
    const { _id } = req.user
    const { file } = req
    const { companyId } = req.params
    if (!file) return res.status(400).json({ message: 'Logo required' })
    const company = await CompanyModel.findOne({
        _id: companyId, bannedAt: { $exists: false }, deletedAt: { $exists: false }
    })
    if (!company) return res.status(404).json({ message: 'Company not found' })
    const { logo, CreatedBy } = company
    if (_id.toString() !== CreatedBy.toString()) return res.status(400).json({ message: 'Unauthorized' })
    if (logo && logo.secure_url) await cloudinary().uploader.destroy(logo.public_id)
    const { secure_url, public_id } = await cloudinary().uploader.upload(
        file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Company/Logo`,
            resource_type: 'image'
        }
    )
    company.logo = { secure_url, public_id }
    await company.save()
    res.status(200).json({ message: 'Company logo uploaded successfully' })
}

// Upload company Cover Pic
export const uploadCompanyCoverService = async (req, res) => {
    const { _id } = req.user
    const { file } = req
    const { companyId } = req.params
    if (!file) return res.status(400).json({ message: 'Cover required' })
    const company = await CompanyModel.findOne({
        _id: companyId, bannedAt: { $exists: false }, deletedAt: { $exists: false }
    })
    if (!company) return res.status(404).json({ message: 'Company not found' })
    const { coverPic, CreatedBy } = company
    if (_id.toString() !== CreatedBy.toString()) return res.status(400).json({ message: 'Unauthorized' })
    if (coverPic && coverPic.secure_url) await cloudinary().uploader.destroy(coverPic.public_id)
    const { secure_url, public_id } = await cloudinary().uploader.upload(file.path,
        {
            folder: `${process.env.CLOUDINARY_FOLDER}/Company/Cover`,
            resource_type: 'image'
        }
    )
    company.coverPic = { secure_url, public_id }
    await company.save()
    res.status(200).json({ message: 'Company logo uploaded successfully' })
}

// Delete company logo
export const deleteLogoService = async (req, res) => {
    const { _id } = req.user
    const { companyId } = req.params
    const company = await CompanyModel.findOne({
        _id: companyId, bannedAt: { $exists: false }, deletedAt: { $exists: false }
    })
    if (!company) return res.status(404).json({ message: 'Company not found' })
    const { logo, CreatedBy } = company
    if (_id.toString() !== CreatedBy.toString()) return res.status(400).json({ message: 'Company not found' })
    if (!logo.secure_url) return res.status(400).json({ message: 'company logo already deleted' })
    await CompanyModel.findByIdAndUpdate(companyId, { $unset: { logo: '' } })
    await cloudinary().uploader.destroy(logo.public_id)
    return res.status(200).json({ message: 'Company logo deleted successfully' })
}

// Delete company Cover Pic
export const deleteCoverService = async (req, res) => {
    const { _id } = req.user
    const { companyId } = req.params
    const company = await CompanyModel.findOne({
        _id: companyId, bannedAt: { $exists: false }, deletedAt: { $exists: false }
    })
    if (!company) return res.status(404).json({ message: 'Company not found' })
    const { coverPic, CreatedBy } = company
    if (_id.toString() !== CreatedBy.toString()) return res.status(400).json({ message: 'Unauthorized' })
    if (!coverPic.secure_url) return res.status(400).json({ message: 'company cover already deleted' })
    await CompanyModel.findByIdAndUpdate(companyId, { $unset: { coverPic: '' } })
    await cloudinary().uploader.destroy(coverPic.public_id)
    res.status(200).json({ message: 'Company cover deleted successfully' })
}
