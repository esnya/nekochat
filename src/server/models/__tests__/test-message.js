describe('Message', () => {
    const {Model} = require('../model');

    const {
        Room,
    } = require('../room');

    jest.dontMock('../message');
    const {
        Message,
        TEXT,
    } = require('../message');

    const {
        find,
        findAll,
        insert,
    } = Model.prototype;

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('messages', 'id', 'DESC');
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

    pit('finds all messages', () => {
        const result = [
            { id: 1, message: 'msg1' },
            { id: 2, message: 'msg2\nline' },
            {
                id: 3,
                message: '[[{"type": "NODE_TYPE_TEXT", "text": "msg3"}]]',
            },
        ];
        const query = Promise.resolve(result);
        query.where = jest.genMockFn().mockReturnValue(query);
        findAll.mockReturnValue(query);

        return Message.findAll('room1', 'user1')
            .then((messages) => {
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

    pit('finds message', () => {
        const result = { id: 1, message: 'msg1' };
        const query = Promise.resolve(result);
        query.where = jest.genMockFn().mockReturnValue(query);
        find.mockReturnValue(query);

        return Message.find('id', 1)
            .then((message) => {
                expect(message).toEqual({
                    id: 1,
                    message: [[{
                        type: TEXT,
                        text: 'msg1',
                    }]],
                });
            });
    });

    it('recovers error', () => {
        expect(Message.transform({
            message: '[hoge]',
        })).toEqual({message: [[{
            type: TEXT,
            text: '[hoge]',
        }]]});

        expect(Message.transform({id: 3})).toEqual({id: 3});

        JSON.parse = null;

        try {
            Message.transform({
                message: '[hoge]',
            });
            throw new Error('it throws error');
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    pit('inserts message', () => {
        Room.find.mockClear();
        Room.find.mockReturnValue(Promise.resolve({
            id: 'room1',
            user_id: 'user1',
            state: 'open',
        }));

        insert.mockClear();
        insert.mockReturnValue(Promise.resolve({
            room_id: 'room1',
            mesage: 'hoge',
        }));

        return Message.insert({
            room_id: 'room1',
            message: 'hoge',
        }).then((message) => {
            expect(message).toEqual({
                room_id: 'room1',
                mesage: 'hoge',
            });

            expect(Room.find).toBeCalledWith('id', 'room1');
            expect(insert).toBeCalledWith({
                room_id: 'room1',
                message: 'hoge',
            });
        });
    });

    pit('forbit to insert message on closed room', () => {
        Room.find.mockClear();
        Room.find.mockReturnValue(Promise.resolve({
            id: 'room2',
            user_id: 'user2',
            state: 'close',
        }));

        insert.mockClear();

        return Message.insert({
            room_id: 'room2',
            message: 'hoge',
        }).then(() => {
            throw new Error('Promise should not be resolved');
        }, (e) => {
            expect(e).toEqual('Cannot insert to closed room');
            expect(insert).not.toBeCalled();
        });
    });
});
