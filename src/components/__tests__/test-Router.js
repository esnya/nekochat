jest.dontMock('react');
describe('Router', () => {
    jest.dontMock('../Router');
    const Router = require('../Router').Router;
});