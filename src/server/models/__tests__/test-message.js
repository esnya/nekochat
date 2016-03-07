describe('Message', () => {
    const {
        Model,
    } = require('../model');

    jest.dontMock('../message');
    const {
        Message,
        TEXT,
    } = require('../message');

    const {
        findAll,
    } = Model.prototype;

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('messages');
    });

    pit('finds top 20 messages in room', () => {
        const query = Promise.resolve([
            { id: 1, message: 'msg1' },
            { id: 2, message: 'msg2\nline' },
            {
                id: 3,
                message: '[[{"type": "NODE_TYPE_TEXT", "text": "msg3"}]]',
            },
        ]);
        query.limit = jest.genMockFn().mockReturnValue(query);
        query.where = jest.genMockFn().mockReturnValue(query);
        findAll.mockReturnValue(query);

        return Message
            .findLimit('room1', 'user1', 'id', '>', 0)
            .then((messages) => {
                expect(query.limit).toBeCalledWith(20);
                expect(query.where).toBeCalled();

                expect(
                    query
                        .where
                        .mock
                        .calls
                        .length
                ).toBe(2);
                const callback = query
                    .where
                    .mock
                    .calls
                    .find((call) => typeof(call[0]) === 'function')[0];
                const finder = query
                    .where
                    .mock
                    .calls
                    .find((call) => typeof(call[0]) !== 'function');
                expect(finder).toEqual(['id', '>', 0]);

                const query2 = {};
                query2.where = jest.genMockFn().mockReturnValue(query2);
                query2.orWhere = jest.genMockFn().mockReturnValue(query2);
                query2.orWhereNull = jest.genMockFn().mockReturnValue(query2);
                query2.whereNull = jest.genMockFn().mockReturnValue(query2);
                callback.call(query2);

                expect(
                    query2
                        .where
                        .mock
                        .calls
                        .concat(query2.orWhere.mock.calls)
                ).toEqual([
                    ['whisper_to', 'user1'],
                    ['user_id', 'user1'],
                ]);
                expect(
                    query2
                        .whereNull
                        .mock
                        .calls
                        .concat(query2.orWhereNull.mock.calls)
                ).toEqual([
                    ['whisper_to'],
                ]);

                expect(messages).toEqual([
                    { id: 1, message: [[{
                        type: TEXT,
                        text: 'msg1',
                    }]] },
                    { id: 2, message: [
                        [{
                            type: TEXT,
                            text: 'msg2',
                        }],
                        [{
                            type: TEXT,
                            text: 'line',
                        }],
                    ] },
                    { id: 3, message: [[{
                        type: 'NODE_TYPE_TEXT',
                        text: 'msg3',
                    }]]},
                ]);
            });
    });
});
