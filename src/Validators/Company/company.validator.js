import Joi from 'joi';

export const addCompanyValidator = {
    body: Joi.object({
        companyName: Joi.string().trim().min(2).max(100).required(),
        description: Joi.string().trim().max(500).allow(""),
        industry: Joi.string().trim().max(100).allow(""),
        address: Joi.string().trim().max(255).allow(""),
        numberOfEmployees: Joi.string()
            .pattern(/^[0-9]+-[0-9]+$/)
            .custom((value, helpers) => {
                const range = value.split("-").map(Number);
                if (range.length !== 2 || range[0] >= range[1]) {
                    return helpers.message("numberOfEmployees must be a valid range like '11-20'");
                }
                return value;
            })
            .required(),
        companyEmail: Joi.string().email().required(),
        HRs: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(),
    })
}

export const updateCompanyValidator = {
    body: Joi.object({
        companyName: Joi.string().trim().min(2).max(100).optional(),
        description: Joi.string().trim().max(500).allow("").optional(),
        industry: Joi.string().trim().max(100).allow("").optional(),
        address: Joi.string().trim().max(255).allow("").optional(),
        numberOfEmployees: Joi.string()
            .pattern(/^[0-9]+-[0-9]+$/)
            .custom((value, helpers) => {
                const range = value.split("-").map(Number);
                if (range.length !== 2 || range[0] >= range[1]) {
                    return helpers.message("numberOfEmployees must be a valid range like '11-20'");
                }
                return value;
            })
            .optional(),
        companyEmail: Joi.string().email().optional(),
        CreatedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        HRs: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).optional(),
    }),
    params: Joi.object({
        companyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    })
}

export const companyIdValidator = {
    params: Joi.object({
        companyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    })
}