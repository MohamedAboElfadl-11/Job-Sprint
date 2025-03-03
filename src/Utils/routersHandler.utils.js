import { globalErrorHandler } from "../Middlewares/errorHandler.middleware.js"
import authRouters from "../Modules/Auth/auth.controller.js"
import userRouters from "../Modules/User/user.controller.js"

const controllerHandler = (app) => {
    app.use('/auth', authRouters)
    app.use('/user', userRouters)
    app.use(globalErrorHandler)
}

export default controllerHandler