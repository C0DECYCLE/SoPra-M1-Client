export function log(...data) {
  return logger("log", ...data);
}

export function warn(...data) {
  return logger("warn", ...data);
}

const logger_maximum = 256;
let logger_count = 0;

function logger(type, ...data) {
  logger_count++;
  if (logger_count === logger_maximum + 1) {
    return console.warn("Logger: Maximum count exeeded.");
  } else if (logger_count < logger_maximum + 1) {
    return console[type](...data);
  }
}
