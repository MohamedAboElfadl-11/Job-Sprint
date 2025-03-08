import { globalErrorHandler } from "../Middlewares/errorHandler.middleware.js"
import adminRouters from "../Modules/Admin/admin.controller.js"
import applicationRouters from "../Modules/Application/application.controller.js"
import authRouters from "../Modules/Auth/auth.controller.js"
import companyRouters from "../Modules/Company/company.controller.js"
import jobRouters from "../Modules/Job/job.controller.js"
import userRouters from "../Modules/User/user.controller.js"

const controllerHandler = (app) => {
    app.use('/auth', authRouters)
    app.use('/user', userRouters)
    app.use('/company', companyRouters)
    app.use('/admin', adminRouters)
    app.use('/job', jobRouters)
    app.use('/application', applicationRouters)
    app.get('/', async (req, res) => { res.status(200).json({ message: "appworkdone" }) })
    app.use(globalErrorHandler)
}

export default controllerHandler