export class Logger {
  error(message: string, ...args: any[]) {
    console.error(`[Recovery System] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[Recovery System] ${message}`, ...args);
  }

  info(message: string, ...args: any[]) {
    console.info(`[Recovery System] ${message}`, ...args);
  }
}