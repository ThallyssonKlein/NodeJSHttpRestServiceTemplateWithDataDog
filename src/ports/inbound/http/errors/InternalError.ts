import HttpError from "./HttpError"

export default class InternalError extends HttpError {
    constructor(message: string) {
        super(message, "InternalError", 500)
    }
}