import Joi from "joi";
import { applicationStatus } from "../../Constants/constants.js";

export const createApplicationValidation = {
    params: Joi.object({
        jobId: Joi.string().hex().length(24).required().messages({
            "string.base": "jobId must be a string",
            "string.length": "jobId must be a valid MongoDB ObjectId (24 characters)",
            "any.required": "jobId is required",
        }),
    }),
};

export const getApplicationsValidation = {
    params: Joi.object({
        jobId: Joi.string().hex().length(24).required().messages({
            "string.base": "jobId must be a string",
            "string.length": "jobId must be a valid MongoDB ObjectId (24 characters)",
            "any.required": "jobId is required",
        }),
    }),
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1).messages({
            "number.base": "Page must be a number",
            "number.min": "Page must be at least 1",
        }),
        limit: Joi.number().integer().min(1).default(10).messages({
            "number.base": "Limit must be a number",
            "number.min": "Limit must be at least 1",
        }),
        sort: Joi.string().valid("createdAt").default("createdAt").messages({
            "string.base": "Sort must be a string",
            "any.only": "Sort must be 'createdAt'",
        }),
    }),
};

export const acceptOrRejectValidation = {
    params: Joi.object({
        jobId: Joi.string().hex().length(24).required().messages({
            "string.base": "jobId must be a string",
            "string.length": "jobId must be a valid MongoDB ObjectId (24 characters)",
            "any.required": "jobId is required",
        }),
        applicationId: Joi.string().hex().length(24).required().messages({
            "string.base": "applicationId must be a string",
            "string.length": "applicationId must be a valid MongoDB ObjectId (24 characters)",
            "any.required": "applicationId is required",
        }),
    }),
    body: Joi.object({
        status: Joi.string().valid(...Object.values(applicationStatus)).required().messages({
            "string.base": "Status must be a string",
            "any.only": `Status must valid`,
            "any.required": "Status is required",
        }),
    }),
};
