import { Router } from "express";
import * as auth from "./Services/authentication.service.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validation from "../../Validators/Auth/auth.validator.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";

const authRouters = Router();

authRouters.post('/signup',
    validationMiddleware(validation.signUpValidator),
    errorHandlerMiddleware(auth.signUpService)
)

authRouters.post('/verifyAccount',
    validationMiddleware(validation.verifyAccountValidator),
    errorHandlerMiddleware(auth.verifyAccountService)
)

authRouters.post('/login',
    validationMiddleware(validation.loginValidator),
    errorHandlerMiddleware(auth.loginService)
)

authRouters.get('/genRefreshToken',
    errorHandlerMiddleware(auth.refreshTokenService)
)

authRouters.get('/logout',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(auth.logoutService)
)

authRouters.post('/forgetPassword',
    validationMiddleware(validation.forgetPasswordValidator),
    errorHandlerMiddleware(auth.forgetPasswordService)
)

authRouters.post('/resetPassword',
    validationMiddleware(validation.resetPasswordValidator),
    errorHandlerMiddleware(auth.resetPasswordService)
)

authRouters.post("/gmail-login",
    errorHandlerMiddleware(auth.loginGmailService)
)

authRouters.post("/gmail-signup",
    errorHandlerMiddleware(auth.signupGmailService)
)

export default authRouters