import proxy from "express-http-proxy"

export const proxyWithHeader = (serviceUrl, servicePrefix) => {
    return proxy(serviceUrl, {
        limit: "25mb",
        proxyReqPathResolver: (req) => {
            const path = req.originalUrl || req.url || "/";
            return path.replace(new RegExp(`^${servicePrefix || ""}`), "") || "/";
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = proxyReqOpts.headers || {};

            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userID || srcReq.user.userId || srcReq.user._id;
            }

            return proxyReqOpts;
        }
    });
};