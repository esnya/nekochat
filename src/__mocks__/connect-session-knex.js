const mockStore = jest.fn();

module.exports = jest.fn().mockReturnValue(mockStore);
module.exports.mockStore = mockStore;
