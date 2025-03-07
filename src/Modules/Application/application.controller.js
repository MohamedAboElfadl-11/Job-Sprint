import { Router } from "express";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { checkAuthUser } from "../../Middlewares/checkUser.middleware.js";
import * as application from "./Service/application.service.js";
import { MulterCloud } from "../../Middlewares/multer.middleware.js";
import { imageExtentions } from "../../Constants/constants.js";
import * as validator from "../../Validators/Application/application.validator.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";

const applicationRouters = Router()

applicationRouters.post('/create/:jobId',
    MulterCloud(imageExtentions).single('attachment'),
    validationMiddleware(validator.createApplicationValidation),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(application.createApplicationService)
)

applicationRouters.get('/getApplications/:jobId',
    validationMiddleware(validator.getApplicationsValidation),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(application.getApplicationsService)
)

applicationRouters.patch('/acceptedOrRejectedApp/:jobId/:applicationId',
    validationMiddleware(validator.acceptOrRejectValidation),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(application.acceptOrRejectApplicantService)
)

export default applicationRouters