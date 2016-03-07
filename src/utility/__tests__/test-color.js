jest.dontMock('color-space');
describe('color', () => {
    jest.dontMock('../color');
    require('../color');
});
