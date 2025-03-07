import CompanyModel from "../../../DB/Models/company.model.js";
import JobOpportunityModel from "../../../DB/Models/jobOpportunity.model.js";

// create job service
export const createJobService = async (req, res) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy, companyId } = req.body;
    const ownerId = req.user._id
    const owner = await CompanyModel.findOne({
        _id: companyId,
        $or: [{ CreatedBy: ownerId }, { HRs: ownerId }],
    })
    if (!owner) return res.status(404).json({ message: "Unauthorized" })
    const newJob = new JobOpportunityModel({
        jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy: ownerId, companyId
    })
    await newJob.save();
    res.status(201).json({ message: "Job added successfully", job: newJob });
}

// update job service
export const updateJobService = async (req, res) => {
    const { jobTitle, jobLocation, workingTime,
        seniorityLevel, jobDescription, technicalSkills, softSkills, closed } = req.body;
    const { jobId } = req.params
    const job = await JobOpportunityModel.findOne({ _id: jobId })
    if (!job) return res.status(404).json({ message: "Job not found" });
    const ownerId = req.user._id
    const owner = await CompanyModel.findOne({
        _id: job.companyId, CreatedBy: ownerId, bannedAt: { $exists: false }, deletedAt: { $exists: false }
    })
    if (!owner) return res.status(401).json({ message: "You can't update this job" })
    if (jobTitle) job.jobTitle = jobTitle;
    if (jobDescription) job.jobDescription = jobDescription;
    if (jobLocation) job.jobLocation = jobLocation;
    if (workingTime) job.workingTime = workingTime;
    if (seniorityLevel) job.seniorityLevel = seniorityLevel;
    if (technicalSkills) job.technicalSkills = technicalSkills;
    if (softSkills) job.softSkills = softSkills;
    if (closed) job.closed = closed
    job.updatedBy = owner.CreatedBy
    await job.save()
    res.status(200).json({ message: "Job updated successfully" })
}

// delete job
export const deleteJobService = async (req, res) => {
    const { jobId } = req.params
    const job = await JobOpportunityModel.findOne({ _id: jobId })
    if (!job) return res.status(404).json({ message: "Job not found" });
    const ownerId = req.user._id
    const company = await CompanyModel.findOne({
        _id: job.companyId, HRs: ownerId, bannedAt: { $exists: false }, deletedAt: { $exists: false }
    })
    if (!company) return res.status(401).json({ message: "You can't delete this job" })
    await JobOpportunityModel.deleteOne({ _id: jobId });
    res.status(200).json({ message: "Job deleted successfully" });
}

// Get all Jobs or a specific one for a specific company. 
export const specificSearchService = async (req, res) => {
    const { companyId, jobId } = req.params;
    const { page = 1, limit = 10, sort = "createdAt", order = "desc", companyName } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;
    let filter = {};
    if (jobId) filter._id = jobId;
    if (companyId) filter.companyId = companyId;
    if (companyName) {
        const company = await CompanyModel.findOne({
            companyName: { $regex: `^${companyName}`, $options: "i" },
            bannedAt: { $exists: false }, deletedAt: { $exists: false }
        });
        if (!company) return res.status(404).json({ message: "Company not found" });
        filter.companyId = company._id;
    }
    const jobs = await JobOpportunityModel.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ [sort]: sortOrder })
        .populate("companyId", "companyName")
        .populate("addedBy", "name email firstName lastName")
    const totalJobs = await JobOpportunityModel.countDocuments(filter);
    res.status(200).json({ totalJobs, page: parseInt(page), limit: parseInt(limit), jobs });
}

// Get all Jobs that match the following filters and if no filters apply then get all jobs
export const filterJobsService = async (req, res) => {
    const { page = 1, limit = 10, sort = "createdAt", order = "desc",
        workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills
    } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;
    let filter = {};
    if (workingTime) filter.workingTime = workingTime;
    if (jobLocation) filter.jobLocation = jobLocation;
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
    if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };
    if (technicalSkills) {
        const skillsArray = technicalSkills.split(",").map(skill => skill.trim());
        filter.technicalSkills = { $in: skillsArray };
    }
    const jobs = await JobOpportunityModel.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ [sort]: sortOrder })
        .populate("companyId", "companyName")
        .populate("addedBy", "name email firstName lastName");
    const totalJobs = await JobOpportunityModel.countDocuments(filter);
    res.status(200).json({ totalJobs, page: parseInt(page), limit: parseInt(limit), jobs });
};
