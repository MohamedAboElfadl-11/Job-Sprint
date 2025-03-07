import { Router } from "express";
import * as job from "./Service/job.service.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { checkAuthUser } from "../../Middlewares/checkUser.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validator from "../../Validators/Job/job.validator.js";

const jobRouters = Router()

jobRouters.post('/createJob',
    validationMiddleware(validator.createJobValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(job.createJobService)
)

jobRouters.patch('/updateJob/:jobId',
    validationMiddleware(validator.updateJobValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(job.updateJobService)
)

jobRouters.delete('/deleteJob/:jobId',
    validationMiddleware(validator.jobIdValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(job.deleteJobService)
)

jobRouters.get('/specificSearch/:companyId?/:jobId?',
    validationMiddleware(validator.specificSearchValidator),
    errorHandlerMiddleware(job.specificSearchService)
)
jobRouters.get('/filter',
    validationMiddleware(validator.filterJobsValidator),
    errorHandlerMiddleware(job.filterJobsService)
)
export default jobRouters