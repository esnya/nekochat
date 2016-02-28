export const mockApp = {
    use: jest.genMockFn(),
    set: jest.genMockFn(),
    get: jest.genMockFn(),
    post: jest.genMockFn(),
};

const express = jest.genMockFn().mockReturnValue(mockApp);
export default express;

express.static = jest.genMockFn();