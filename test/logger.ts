export class ConsoleLogger {
    public trace(message?: any, ...optionalParams: any[]) { this._log("trace", message, ...optionalParams) }
    public debug(message?: any, ...optionalParams: any[]) { this._log("debug", message, ...optionalParams) }
    public info (message?: any, ...optionalParams: any[]) { this._log("info",  message, ...optionalParams) }
    public warn (message?: any, ...optionalParams: any[]) { this._log("warn",  message, ...optionalParams) }
    public error(message?: any, ...optionalParams: any[]) { this._log("error", message, ...optionalParams) }
    public fatal(message?: any, ...optionalParams: any[]) { this._log("fatal", message, ...optionalParams) }

    private _log(level: any, message?: any, ...optionalParams: any[]): null {
        if (!optionalParams) {
            switch (level) {
                case "trace": console.trace(message); break
                case "debug": console.debug(message); break
                case "info":  console.info(message);  break
                case "warn":  console.warn(message);  break
                case "error": console.error(message); break
                case "fatal": console.error(message); break
                default: break
            }
            return null
        } else {
            switch (level) {
                case "trace": console.trace(message, ...optionalParams); break
                case "debug": console.debug(message, ...optionalParams); break
                case "info":  console.info(message,  ...optionalParams); break
                case "warn":  console.warn(message,  ...optionalParams); break
                case "error": console.error(message, ...optionalParams); break
                case "fatal": console.error(message, ...optionalParams); break
                default: break
            }
            return null
        }

    }
}

export const logger = new ConsoleLogger()
