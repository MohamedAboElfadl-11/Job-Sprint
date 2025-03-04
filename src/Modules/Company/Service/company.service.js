import CompanyModel from "../../../DB/Models/company.model.js"

// create company service
export const addCompanyService = async (req, res) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail, CreatedBy, HRs, } = req.body
    const isCompanyEmailExist = await CompanyModel.findOne({ companyEmail })
    if (isCompanyEmailExist) return res.status(409).json({ message: "company email already exist" })

    const isCompanyNameExist = await CompanyModel.findOne({ companyName })
    if (isCompanyNameExist) return res.status(409).json({ message: "company name already exist" })

    await CompanyModel.create({ companyName, companyEmail, description, industry, address, numberOfEmployees, CreatedBy, HRs })
    res.status(200).json({ message: "Company created successfully" })
}