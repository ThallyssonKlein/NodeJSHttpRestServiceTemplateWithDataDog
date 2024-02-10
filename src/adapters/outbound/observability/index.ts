import DataDogPort, { Span } from "dd-trace";

type SpanDict = {
    [key: string]: Span;
}

export default class Observability {
    private currentTransaction: Span | null = null;
    private spanDict: SpanDict = {};

    constructor() {}

    startTransaction(name: string): void {
        this.currentTransaction = DataDogPort.startSpan(name);
    }

    startSpan(name: string): void {
        this.spanDict[name] = DataDogPort.startSpan(name, {childOf: this.currentTransaction})
    }

    endTransaction(): void {
        if (this.currentTransaction) {
            this.currentTransaction.finish();
        }
    }

    endSpan(name: string): void {
        if (this.spanDict[name]) {
            this.spanDict[name].finish();
        }
    }

    addDataToTransaction(key: string, data: any): void {
        if (this.currentTransaction) {
            this.currentTransaction.setTag(key, data);
        }
    }

    addDataToSpan(spanName: string, key: string, data: any): void {
        if (this.spanDict[spanName]) {
            this.spanDict[spanName].setTag(key, data);
        }
    }
}