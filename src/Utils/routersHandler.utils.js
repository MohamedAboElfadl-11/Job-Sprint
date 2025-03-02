import { globalErrorHandler } from "../Middlewares/errorHandler.middleware.js"
import authRouters from "../Modules/Auth/auth.controller.js"

const controllerHandler = (app) => {
    app.use('/auth', authRouters)
    app.use(globalErrorHandler)
}

export default controllerHandler