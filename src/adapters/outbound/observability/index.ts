import * as SentryPort from "@sentry/node";

type SpanDict = {
    [key: string]: SentryPort.Span;
}

export default class Observability {
    private currentTransaction: SentryPort.Transaction | null = null;
    private spanDict: SpanDict = {};

    constructor() {}

    startTransaction(name: string): void {
        this.currentTransaction = SentryPort.startTransaction({
            name,
        });
    }

    startSpan(name: string): void {
        this.spanDict[name] = this.currentTransaction.startChild({
            op: name,
        })
    }

    endTransaction(): void {
        if (this.currentTransaction) {
            this.currentTransaction.end();
        }
    }

    endSpan(name: string): void {
        if (this.spanDict[name]) {
            this.spanDict[name].end();
        }
    }

    addDataToTransaction(key: string, data: any): void {
        if (this.currentTransaction) {
            this.currentTransaction.setAttribute(key, data);
        }
    }

    addDataToSpan(spanName: string, key: string, data: any): void {
        if (this.spanDict[spanName]) {
            this.spanDict[spanName].setAttribute(key, data);
        }
    }

    captureException(exception: Error): void {
        SentryPort.captureException(exception);
    }
}