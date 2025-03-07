import { Router } from "express";
import { roles } from "../../Constants/constants.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { checkAuthUser } from "../../Middlewares/checkUser.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authirization.middleware.js";
import * as admin from "./Service/admin.service.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validator from "../../Validators/Admin/admin.validator.js";

const adminRouters = Router()

const { ADMIN } = roles

adminRouters.post('/approveCompany',
    validationMiddleware(validator.approveCompanyValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    authorizationMiddleware([ADMIN]),
    errorHandlerMiddleware(admin.approveCompanyService)
)

adminRouters.post('/bannedUser',
    validationMiddleware(validator.banUserValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    authorizationMiddleware([ADMIN]),
    errorHandlerMiddleware(admin.banUserService)
)

adminRouters.post('/bannedCompany',
    validationMiddleware(validator.banCompanyValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    authorizationMiddleware([ADMIN]),
    errorHandlerMiddleware(admin.banCompanyService)
)

export default adminRouters