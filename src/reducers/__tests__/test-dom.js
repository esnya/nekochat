describe('reducers', () => {
    describe('dom', () => {
        jest.autoMockOff();

        const Immutable = require('immutable');
        const { Map } = Immutable;

        const { focus, blur } = require('../../actions/dom');
        const reducer = require('../dom').default;

        let state;
        it('has state of {focused: true} initially', () => {
            state = reducer(undefined, {type: 'INIT'});
            expect(state).toEqualImmutable(Map({focused: true}));
        });

        it('handles blur event', () => {
            state = reducer(state, blur());
            expect(state).toEqualImmutable(Map({focused: false}));
        });

        it('handles focus event', () => {
            state = reducer(state, focus());
            expect(state).toEqualImmutable(Map({focused: true}));
        });
    });
});
