export default class Logger {

    static log(className, method, message, ...more) {

        console.log(
            `%c ${className} %c ${method} %c ${message}`,
            'font-family: monospace; background-color: #121212; color: #FFFFFF; font-weight: bold',
            'font-family: monospace; background-color: #0096FA; color: #FFFFFF; font-weight: bold',
            'font-family: monospace; font-weight: normal',
            ...more
        );
    }

    static error(className, method, message, ...more) {

        console.log(
            `%c ${className} %c ${method} %c ${message}`,
            'font-family: monospace; background-color: #121212; color: #FFFFFF; font-weight: bold',
            'font-family: monospace; background-color: #0096FA; color: #FFFFFF; font-weight: bold',
            'font-family: monospace; color: #FF4242',
            ...more
        );
    }

}