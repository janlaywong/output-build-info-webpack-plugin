const {CONSOLE_PAINT} = require('./enum');

const Warn = (message = '') => {
    console.info(CONSOLE_PAINT, message);
};

module.exports = {
    Warn
};
