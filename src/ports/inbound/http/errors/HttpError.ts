export default abstract class HttpError extends Error {
    private status: number;

    constructor(message: string, name: string, status: number) {
        super(message);
        this.name = name;
        this.status = status;
    }

    getStatus(): number {
        return this.status;
    }
    
    setStatus(status: number): void {
        this.status = status;
    }
}