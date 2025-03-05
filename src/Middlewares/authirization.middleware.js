export const authorizationMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const { role } = req.user;
            const isRoleAllowed = allowedRoles.includes(role);
            if (!isRoleAllowed) return res.status(401).json({ message: "Unauthorized" })
            next()
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error: `server error try later ${error}`,
            });
        }
    }
}

/**
 *return (req, res, next) => {
        const { role } = req.user;
        const isRoleAllowed = allowedRoles.includes(role);
        console.log({ role, isRoleAllowed, allowedRoles })
        if (!isRoleAllowed) return res.status(401).json({ message: "Unauthorized" })
        next()
    } 
*/