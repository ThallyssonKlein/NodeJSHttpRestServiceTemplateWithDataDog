export default class NotAllowedToBeFound extends Error {
    constructor(message: string) {
        super(message)
        this.name = "NotAllowedToBeFound"
    }
}