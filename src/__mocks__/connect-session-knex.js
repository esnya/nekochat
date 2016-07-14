const mockStore = jest.genMockFn();

module.exports = jest.genMockFn().mockReturnValue(mockStore);
module.exports.mockStore = mockStore;
