var debug = {};

debug.log = function (...args) {
    if (__DEV__) {
        console.log(...args);
    }
};

debug.info = function (...args) {
    if (__DEV__) {
        console.info(...args);
    }
};

debug.warn = function (...args) {
    if (__DEV__) {
        console.warn(...args);
    }
};

debug.error = function (...args) {
    if (__DEV__) {
        console.error(...args);
    }
};

export default debug;
