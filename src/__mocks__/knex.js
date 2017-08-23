const mockKnex = jest.fn();
mockKnex.schema = {
    createTableIfNotExists: jest.fn().mockReturnValue(Promise.resolve()),
};
mockKnex.migrate = {
    latest: jest.fn().mockReturnValue(Promise.resolve()),
};
mockKnex.seed = {
    run: jest.fn().mockReturnValue(Promise.resolve()),
};

const Knex = module.exports = jest.fn().mockReturnValue(mockKnex);
Knex.mockKnex = mockKnex;
