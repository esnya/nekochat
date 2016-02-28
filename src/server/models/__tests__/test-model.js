describe('Model', () => {
    const knex = require('../../knex').knex;

    jest.dontMock('../model');
    const {
        NOT_FOUND,
        Model,
    } = require('../model');

    let query;
    beforeEach(() => {
        query = {};

        query.where = jest.genMockFn()
            .mockReturnValue(query);
        query.whereNull = jest.genMockFn()
            .mockReturnValue(query);
        query.orderBy = jest.genMockFn()
            .mockReturnValue(query);
        query.first = jest.genMockFn()
            .mockReturnValue(query);
        query.insert = jest.genMockFn()
            .mockReturnValue(query);
        query.update = jest.genMockFn()
            .mockReturnValue(query);

        query.then = jest.genMockFn();

        knex.mockClear();
        knex.mockReturnValue(query);

        knex.fn = {
            now: jest.genMockFn().mockReturnValue(Date.now()),
        };
    });

    pit('lists all of items which have not been deleted', () => {
        query.then.mockReturnValueOnce(Promise.resolve([
            { id: 0 },
            { id: 1 },
            { id: 2 },
        ]));

        return new Model('items')
            .findAll()
            .then((items) => {
                expect(knex).toBeCalledWith('items');
                expect(query.orderBy).toBeCalledWith('created', 'DESC');
                expect(query.whereNull).toBeCalledWith('deleted');
                expect(items).toEqual([
                    { id: 0 },
                    { id: 1 },
                    { id: 2 },
                ]);
            });
    });

    pit('lists all of items with conditions', () => {
        query.then.mockReturnValueOnce(Promise.resolve([
            { id: 1 },
            { id: 2 },
        ]));

        return new Model('items')
            .findAll('id', '>', '0')
            .then((items) => {
                expect(knex).toBeCalledWith('items');
                expect(query.orderBy).toBeCalledWith('created', 'DESC');
                expect(query.where).toBeCalledWith('id', '>', '0');
                expect(query.whereNull).toBeCalledWith('deleted');
                expect(items).toEqual([
                    { id: 1 },
                    { id: 2 },
                ]);
            });
    });

    pit('finds one item', () => {
        query.then.mockReturnValueOnce(Promise.resolve({
            id: 1,
            value: 'test-2',
        }));

        return new Model('items')
            .find('id', 1)
            .then((item) => {
                expect(knex).toBeCalledWith('items');
                expect(query.first).toBeCalled();
                expect(query.whereNull).toBeCalledWith('deleted');
                expect(query.where).toBeCalledWith('id', 1);
                expect(item).toEqual({
                    id: 1,
                    value: 'test-2',
                });
            });
    });

    pit('rejects when item does not found', () => {
        query.then.mockImpl(
            (callback) => Promise.resolve(null).then(callback)
        );

        return new Model('items')
            .find('id', 2)
            .then(() => Promise.reject('it should not be resolved'))
            .catch((e) => {
                expect(e).toEqual(NOT_FOUND);
                expect(knex).toBeCalledWith('items');
                expect(query.first).toBeCalled();
                expect(query.whereNull).toBeCalledWith('deleted');
                expect(query.where).toBeCalledWith('id', 2);
            });
    });

    pit('creates new item by insert', () => {
        query.then.mockImpl(
            (callback) => {
                query.then.mockImpl(
                    (callback) => Promise.resolve({
                        id: 'id3', value: 'item3',
                        created: knex.fn.now(),
                        modified: knex.fn.now(),
                    }).then(callback)
                );
                return Promise.resolve([2]).then(callback);
            }
        );

        return new Model('items')
            .insert({
                id: 'id3',
                value: 'item3',
            })
            .then((item) => {
                expect(query.insert).toBeCalledWith({
                    id: 'id3',
                    value: 'item3',
                    created: knex.fn.now(),
                    modified: knex.fn.now(),
                });

                expect(item).toEqual({
                    id: 'id3', value: 'item3',
                    created: knex.fn.now(),
                    modified: knex.fn.now(),
                });
            });
    });

    pit('creates new item by insert with autoincrements', () => {
        query.then.mockImpl(
            (callback) => {
                query.then.mockImpl(
                    (callback) => Promise.resolve({
                        id: 4, value: 'item4',
                        created: knex.fn.now(),
                        modified: knex.fn.now(),
                    }).then(callback)
                );
                return Promise.resolve([4]).then(callback);
            }
        );

        return new Model('items')
            .insert({
                value: 'item4',
            })
            .then((item) => {
                expect(query.insert).toBeCalledWith({
                    value: 'item4',
                    created: knex.fn.now(),
                    modified: knex.fn.now(),
                });

                expect(item).toEqual({
                    id: 4, value: 'item4',
                    created: knex.fn.now(),
                    modified: knex.fn.now(),
                });
            });
    });

    pit('deletes item', () => {
        query.then.mockReturnValue(Promise.resolve());

        return new Model('items')
            .del({
                id: 'id5',
                user_id: 'user1',
            })
            .then(() => {
                expect(query.where).toBeCalledWith({
                    id: 'id5',
                    user_id: 'user1',
                });
                expect(query.update).toBeCalledWith('deleted', knex.fn.now());
            });
    });
});
