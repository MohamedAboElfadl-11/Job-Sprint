import { Router } from "express";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validator from "../../Validators/Company/company.validator.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandler.middleware.js";
import * as company from "./Service/company.service.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { checkAuthUser } from "../../Middlewares/checkUser.middleware.js";
import { imageExtentions } from "../../Constants/constants.js";
import { MulterCloud } from "../../Middlewares/multer.middleware.js";

const companyRouters = Router()

companyRouters.post('/addCompany',
    MulterCloud(imageExtentions).single('attachment'),
    validationMiddleware(validator.addCompanyValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(company.addCompanyService)
)

companyRouters.patch('/updateData/:companyId',
    validationMiddleware(validator.updateCompanyValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(company.updateCompanyService)
)

companyRouters.delete('/deleteCompany/:companyId',
    validationMiddleware(validator.companyIdValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(company.deleteCompanyService)
)

companyRouters.get('/searchCompanyByName',
    errorHandlerMiddleware(company.searchCompanyByNameSevice)
)

companyRouters.get('/getCompanyWithJob/:companyId',
    validationMiddleware(validator.companyIdValidator),
    errorHandlerMiddleware(company.getCompanyWithJob)
)

companyRouters.patch('/uploadLogo/:companyId',
    validationMiddleware(validator.companyIdValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    MulterCloud(imageExtentions).single('logo'),
    errorHandlerMiddleware(company.uploadCompanyLogoService)
)

companyRouters.patch('/uploadCover/:companyId',
    validationMiddleware(validator.companyIdValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    MulterCloud(imageExtentions).single('cover'),
    errorHandlerMiddleware(company.uploadCompanyCoverService)
)

companyRouters.patch('/deleteLogo/:companyId',
    validationMiddleware(validator.companyIdValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(company.deleteLogoService)
)

companyRouters.patch('/deleteCover/:companyId',
    validationMiddleware(validator.companyIdValidator),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkAuthUser),
    errorHandlerMiddleware(company.deleteCoverService)
)

export default companyRouters