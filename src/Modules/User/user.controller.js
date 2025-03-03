import { Router } from "express";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import * as user from "./Service/user.service.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validator from "../../Validators/User/user.validators.js";

const userRouters = Router()

userRouters.patch('/updateAccount',
    validationMiddleware(validator.updateAccountValidators),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(user.updateUserAccountService)
)

userRouters.get('/userData',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(user.userData)
)

export default userRouters;