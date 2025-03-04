import { Router } from "express";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validator from "../../Validators/Company/company.validator.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import * as company from "./Service/company.service.js";

const companyRouters = Router()

companyRouters.post('/addCompany',
    validationMiddleware(validator.addCompanyValidator),
    errorHandlerMiddleware(company.addCompanyService)
)

export default companyRouters