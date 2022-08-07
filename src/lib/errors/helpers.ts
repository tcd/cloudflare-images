export interface Error {
    name: string;
    message: string;
    stack?: string;
}

export interface ErrorConstructor {
    new(message?: string): Error;
    (message?: string): Error;
    readonly prototype: Error;
}

// declare const Error: ErrorConstructor
