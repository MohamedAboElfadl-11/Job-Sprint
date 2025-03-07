import Joi from "joi";

export const banUserValidator = {
    body: Joi.object({
        companyEmail: Joi.string().email().required(),
    })
}
export const banCompanyValidator = {
    body: Joi.object({
        companyEmail: Joi.string().email().required(),
    })
}
export const approveCompanyValidator = {
    body: Joi.object({
        companyEmail: Joi.string().email().required(),
    })
}