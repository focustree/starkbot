import { createLogger, transports, format } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ timestamp, level, message, metadata }) => {
    return `[${timestamp.slice(0, -5)}] ${level}: ${message}. ${(Object.keys(metadata).length === 0) ? '' : JSON.stringify(metadata)}`;
});
export const logger = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                timestamp(),
                myFormat
            ),
        }),
    ],
    format: format.combine(format.metadata(), format.timestamp()),
});