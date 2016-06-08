describe('reducers', () => {
    describe('typings', () => {
        jest.autoMockOff();

        const Immutable = require('immutable');
        const { fromJS } = Immutable;

        const { update } = require('../../actions/typing');
        const reducer = require('../typings').default;

        const remoteUpdate = (sender, name, message) => ({
            ...update({ name, message }),
            meta: {
                sender,
            },
        });

        let state;
        it('has state of empty Map initially', () => {
            state = reducer(undefined, {type: 'TEST_INIT'});
            expect(state).isEmpty();
        });

        it('is map of typings', () => {
            state = reducer(state, remoteUpdate('soc1', 'name1', 'msg1'));
            expect(state).toEqualImmutable(fromJS({
                soc1: { name: 'name1', message: 'msg1' },
            }));

            state = reducer(state, remoteUpdate('soc2', 'name2', 'msg2'));
            expect(state).toEqualImmutable(fromJS({
                soc1: { name: 'name1', message: 'msg1' },
                soc2: { name: 'name2', message: 'msg2' },
            }));

            state = reducer(state, remoteUpdate('soc2', 'name2', 'msg2a'));
            expect(state).toEqualImmutable(fromJS({
                soc1: { name: 'name1', message: 'msg1' },
                soc2: { name: 'name2', message: 'msg2a' },
            }));

            state = reducer(state, remoteUpdate('soc1', 'name1a', 'msg1'));
            expect(state).toEqualImmutable(fromJS({
                soc1: { name: 'name1a', message: 'msg1' },
                soc2: { name: 'name2', message: 'msg2a' },
            }));

            state = reducer(state, remoteUpdate('soc1'));
            expect(state).toEqualImmutable(fromJS({
                soc2: { name: 'name2', message: 'msg2a' },
            }));
        });
    });
});
