import { Router } from "express";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import * as user from "./Service/user.service.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validator from "../../Validators/User/user.validators.js";
import { checkAuthUser } from "../../Middlewares/checkUser.middleware.js";
import { MulterCloud } from "../../Middlewares/multer.middleware.js";
import { imageExtentions } from "../../Constants/constants.js";

const userRouters = Router()

userRouters.patch('/updateAccount',
    validationMiddleware(validator.updateAccountValidators),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.updateUserAccountService)
)

userRouters.get('/userData',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.userData)
)

userRouters.get('/profileData/:userId',
    errorHandlerMiddleware(user.profileData)
)

userRouters.patch('/updatePassword',
    validationMiddleware(validator.updatePasswordValidators),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.updatePassword)
)

userRouters.patch('/uploadProfilePic',
    MulterCloud(imageExtentions).single('profile'),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.uploadProfilePicService)
)

userRouters.patch('/uploadCoverPic',
    MulterCloud(imageExtentions).single('cover'),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.uploadCoverPicService)
)

userRouters.patch('/deleteProfilePic',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.deleteProfilePicService)
)

userRouters.patch('/deleteCoverPic',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.deleteCoverPicService)
)

userRouters.delete('/deleteAccount',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(user.deleteAccount)
)

export default userRouters;