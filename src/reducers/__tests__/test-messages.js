describe('reducers', () => {
    describe('messages', () => {
        jest.autoMockOff();

        const Immutable = require('immutable');
        const { fromJS } = Immutable;

        const { create, list, old } = require('../../actions/message');
        const reducer = require('../messages').default;

        let state;
        it('is empty List initially', () => {
            state = reducer(undefined, { type: 'INIT' });
            expect(state).isEmpty();
        });

        it('appends new message', () => {
            state = reducer(state, create({
                name: 'n1',
                message: [[{ type: 'TEXT', text: 'no-id' }]],
                user_id: 'u1',
            }));
            expect(state).isEmpty();

            state = reducer(state, create({
                id: 1,
                name: 'n1',
                message: [[{ type: 'TEXT', text: 'msg1' }]],
                user_id: 'u1',
            }));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 1,
                    name: 'n1',
                    message: [[{ type: 'TEXT', text: 'msg1' }]],
                    user_id: 'u1',
                },
            ]));

            state = reducer(state, create({
                id: 2,
                name: 'n1',
                message: [[{ type: 'TEXT', text: 'msg2' }]],
                user_id: 'u1',
            }));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 1,
                    name: 'n1',
                    message: [[{ type: 'TEXT', text: 'msg1' }]],
                    user_id: 'u1',
                },
                {
                    id: 2,
                    name: 'n1',
                    message: [[{ type: 'TEXT', text: 'msg2' }]],
                    user_id: 'u1',
                },
            ]));
        });

        it('resets by list', () => {
            state = reducer(state, list([
                {
                    id: 3,
                    name: 'n2',
                    message: [[{ type: 'TEXT', text: 'msg3' }]],
                    user_id: 'u1',
                },
                {
                    id: 4,
                    name: 'n3',
                    message: [[{ type: 'TEXT', text: 'msg4' }]],
                    user_id: 'u2',
                },
            ]));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 3,
                    name: 'n2',
                    message: [[{ type: 'TEXT', text: 'msg3' }]],
                    user_id: 'u1',
                },
                {
                    id: 4,
                    name: 'n3',
                    message: [[{ type: 'TEXT', text: 'msg4' }]],
                    user_id: 'u2',
                },
            ]));
        });

        it('prepends old messages', () => {
            state = reducer(state, old([
                {
                    id: 1,
                    name: 'n1',
                    message: [[{ type: 'TEXT', text: 'msg1' }]],
                    user_id: 'u1',
                },
                {
                    id: 2,
                    name: 'n1',
                    message: [[{ type: 'TEXT', text: 'msg2' }]],
                    user_id: 'u1',
                },
            ]));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 1,
                    name: 'n1',
                    message: [[{ type: 'TEXT', text: 'msg1' }]],
                    user_id: 'u1',
                },
                {
                    id: 2,
                    name: 'n1',
                    message: [[{ type: 'TEXT', text: 'msg2' }]],
                    user_id: 'u1',
                },
                {
                    id: 3,
                    name: 'n2',
                    message: [[{ type: 'TEXT', text: 'msg3' }]],
                    user_id: 'u1',
                },
                {
                    id: 4,
                    name: 'n3',
                    message: [[{ type: 'TEXT', text: 'msg4' }]],
                    user_id: 'u2',
                },
            ]));
        });

        it('cleared by leaving', () => {
            const { leave } = require('../../actions/room');
            state = reducer(state, leave());
            expect(state).toEqualImmutable(fromJS([]));
        });
    });
});
