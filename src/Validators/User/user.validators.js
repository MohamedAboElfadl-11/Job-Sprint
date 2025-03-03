import Joi from "joi";

export const updateAccountValidators = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(30).optional(),
        lastName: Joi.string().min(3).max(30).optional(),
        phone: Joi.string().pattern(/^\d{10,15}$/).optional(),
        DOB: Joi.date().iso().optional(),
        gender: Joi.string().optional()
    })
}