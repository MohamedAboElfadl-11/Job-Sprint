import Joi from "joi";
import * as constants from "../../Constants/constants.js";

export const createJobValidator = {
    body: Joi.object({
        jobTitle: Joi.string().min(2).max(100).required(),
        jobLocation: Joi.string().valid(...Object.values(constants.jobLocation)).required(),
        workingTime: Joi.string().valid(...Object.values(constants.workingTime)).required(),
        seniorityLevel: Joi.string().valid(...Object.values(constants.seniorityLevel)).required(),
        jobDescription: Joi.string().min(10).required(),
        technicalSkills: Joi.array().items(Joi.string().min(2)).min(1).required(),
        softSkills: Joi.array().items(Joi.string().min(2)).min(1).required(),
        updatedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        closed: Joi.boolean(),
        companyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    })
}

export const updateJobValidator = {
    body: Joi.object({
        jobTitle: Joi.string().min(2).max(100).optional(),
        jobLocation: Joi.string().valid(...Object.values(constants.jobLocation)).optional(),
        workingTime: Joi.string().valid(...Object.values(constants.workingTime)).optional(),
        seniorityLevel: Joi.string().valid(...Object.values(constants.seniorityLevel)).optional(),
        jobDescription: Joi.string().min(10).optional(),
        technicalSkills: Joi.array().items(Joi.string().min(2)).min(1).optional(),
        softSkills: Joi.array().items(Joi.string().min(2)).min(1).optional(),
        closed: Joi.boolean().optional(),
    }),
    params: Joi.object({
        jobId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    })
}

export const jobIdValidator = {
    params: Joi.object({
        jobId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    })
}

export const specificSearchValidator = {
    params: Joi.object({
        companyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        jobId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    }),
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        sort: Joi.string().valid("createdAt", "updatedAt", "jobTitle").default("createdAt"),
        order: Joi.string().valid("asc", "desc").default("desc"),
        companyName: Joi.string().min(2).max(100).optional()
    })
};

export const filterJobsValidator = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        sort: Joi.string().valid("createdAt", "updatedAt", "jobTitle").default("createdAt"),
        order: Joi.string().valid("asc", "desc").default("desc"),
    }),
    body: Joi.object({
        workingTime: Joi.string().valid(...Object.values(constants.workingTime)).optional(),
        jobLocation: Joi.string().valid(...Object.values(constants.jobLocation)).optional(),
        seniorityLevel: Joi.string().valid(...Object.values(constants.seniorityLevel)).optional(),
        jobTitle: Joi.string().min(2).max(100).optional(),
        technicalSkills: Joi.array().items(Joi.string().min(2)).min(1).optional(),
    })
};