export default class Logger {

    /**
     * Send a stylized log in the console
     *
     * @param {string} className
     *      The class from which this log is being sent
     * @param {string} method
     *      The method from which this log is being sent
     * @param {string} message
     *      The message content for the log
     * @param {any} more
     *      Additional params to use for the console.log call.
     */
    static log(className, method, message, ...more) {

        console.log(
            `%c ${className} %c ${method} %c ${message}`,
            'font-family: monospace; background-color: #121212; color: #FFFFFF; font-weight: bold',
            'font-family: monospace; background-color: #0096FA; color: #FFFFFF; font-weight: bold',
            'font-family: monospace; font-weight: normal',
            ...more
        );
    }

    /**
     * Send a stylized error in the console
     *
     * @param {string} className
     *      The class from which this log is being sent
     * @param {string} method
     *      The method from which this log is being sent
     * @param {string} message
     *      The message content for the log
     * @param {any} more
     *      Additional params to use for the console.error call.
     */
    static error(className, method, message, ...more) {

        console.error(
            `%c ${className} %c ${method} %c ${message}`,
            'font-family: monospace; background-color: #121212; color: #FFFFFF; font-weight: bold',
            'font-family: monospace; background-color: #0096FA; color: #FFFFFF; font-weight: bold',
            'font-family: monospace; color: #FFFFFF',
            ...more
        );
    }

}