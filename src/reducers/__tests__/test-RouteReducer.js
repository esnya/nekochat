/* eslint global-require: 0 */

jest.autoMockOff();

describe('RouteReducer', () => {
    // require('../../constants/RouteActions');
    const reducer = require('../RouteReducer').routeReducer;

    let state;
    it('should be null initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toBeNull();
    });
});