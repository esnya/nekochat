const logger = {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};

module.exports.getLogger = jest.fn().mockReturnValue(logger);
module.exports.mockLogger = logger;
module.exports.configure = jest.fn();
module.exports.connectLogger = jest.fn();
