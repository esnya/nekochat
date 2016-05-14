'use strict';

export const mockStore = jest.genMockFn();
export default jest.genMockFn().mockReturnValue(mockStore);
