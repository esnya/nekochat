jest.dontMock('react');
describe('App', () => {
    jest.dontMock('../App');
    const App = require('../App').App;
});