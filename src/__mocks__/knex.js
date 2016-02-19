const mockPromise = {
    then: jest.genMockFn().mockReturnValue(mockPromise),
    catch: jest.genMockFn().mockReturnValue(mockPromise),
};

const mockKnex = jest.genMockFn();
mockKnex.schema = {
    createTableIfNotExists: jest.genMockFn().mockReturnValue(mockPromise),
};

const Knex = module.exports = jest.genMockFn().mockReturnValue(mockKnex);
Knex.mockKnex = mockKnex;