import { cloudinary } from "../../../Config/cloudinary.config.js";
import { applicationStatus } from "../../../Constants/constants.js";
import ApplicationModel from "../../../DB/Models/application.model.js";
import CompanyModel from "../../../DB/Models/company.model.js";
import JobOpportunityModel from "../../../DB/Models/jobOpportunity.model.js";
import UserModel from "../../../DB/Models/users.model.js";
import { emitter } from "../../../Services/sendEmail.service.js";
import { acceptedTemplate } from "../../../Utils/acceptedApplicant.utils.js";
import { rejectedTemplate } from "../../../Utils/rejectedApplicant.utils.js";

// create application
export const createApplicationService = async (req, res) => {
    const { _id } = req.user;
    const { jobId } = req.params;
    const { file } = req;
    const job = await JobOpportunityModel.findOne(
        { _id: jobId, closed: false }
    )
    const userData = { userId: _id, jobId: job._id }
    if (!job) return res.status(404).json({ message: "job not found" })
    if (file) {
        const { secure_url, public_id } = await cloudinary().uploader.upload(
            file.path,
            {
                folder: `${process.env.CLOUDINARY_FOLDER}/Application/userCv`
            }
        )
        userData.userCV = { secure_url, public_id }
    }
    await ApplicationModel.create(userData)
    res.status(200).json({ message: "Application submitted successfully" })
}

// Get all applications for specific Job.
export const getApplicationsService = async (req, res) => {
    const user = req.user._id
    const { jobId } = req.params
    let { page = 1, limit = 10, sort = "createdAt" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const job = await JobOpportunityModel.findOne({ _id: jobId, closed: false }).populate("application");
    if (!job) return res.status(404).jaon({ message: "job not found" })
    const company = await CompanyModel.findOne({ _id: job.companyId, $or: [{ CreatedBy: user }, { HRs: user }], })
    if (!company) return res.status(404).json({ message: "Unauthorized" })
    const applications = await ApplicationModel.find({ jobId })
        .populate("userId", "firstName lastName email")
        .sort({ [sort]: -1 })
        .skip(skip)
        .limit(limit);
    const totalCount = await ApplicationModel.countDocuments({ jobId });
    return res.status(200).json({
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        applications,
    });
}

// Accept or Reject an Applicant
export const acceptOrRejectApplicantService = async (req, res) => {
    const hr = req.user._id
    const { jobId, applicationId } = req.params
    const { status } = req.body
    const job = await JobOpportunityModel.findOne({ _id: jobId, closed: false })
    if (!job) return res.status(404).jaon({ message: "job not found" })
    const company = await CompanyModel.findOne({ _id: job.companyId, HRs: hr })
    if (!company) return res.status(404).json({ message: "Unauthorized" })
    const application = await ApplicationModel.findById({ _id: applicationId })
    if (!application) return res.status(404).json({ message: "application not found" })
    const applicant = await UserModel.findById({ _id: application.userId })
    if (!applicant) return res.status(404).json({ message: "applicant not found" })
    if (status === applicationStatus.ACCEPTED) {
        application.status = applicationStatus.ACCEPTED
        emitter.emit('sendEmail', {
            subject: `Great News! ${job.jobTitle} Application in ${company.companyName}`,
            to: applicant.email,
            html: acceptedTemplate(applicant.firstName, job.jobTitle, company.companyName)
        })
    }
    else if (status === applicationStatus.REJECTED) {
        application.status = applicationStatus.REJECTED
        emitter.emit('sendEmail', {
            subject: `${job.jobTitle} Application in ${company.companyName}`,
            to: applicant.email,
            html: rejectedTemplate(applicant.firstName, job.jobTitle, company.companyName)
        })
    }
    res.status(200).json({ message: "email sent successfully" })
}