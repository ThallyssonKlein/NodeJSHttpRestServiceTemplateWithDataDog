import HttpError from "./HttpError"

export default class ForbiddenError extends HttpError {
    constructor(message: string) {
        super(message, "ForbiddenError", 403)
    }
}