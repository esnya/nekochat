/* eslint no-underscore-dangle: 0 */

describe('Model', () => {
    const {knex, now} = require('../../knex');

    jest.dontMock('../model');
    const {
        NOT_FOUND,
        Model,
    } = require('../model');

    let query, _now;
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

        knex.schema = {
            hasTable: jest.fn()
                .mockReturnValue(Promise.resolve(true)),
            createTable: jest.fn()
                .mockReturnValue(Promise.resolve(true)),
        };

        _now = Date.now();
        now.mockReturnValue(_now);
    });

    pit('lists all of items which have not been deleted', () => {
        query.then.mockReturnValueOnce(Promise.resolve([
            { id: 0 },
            { id: 1 },
            { id: 2 },
        ]));

        return new Model('items', 'id', 'ASC')
            .findAll()
            .then((items) => {
                expect(knex).toBeCalledWith('items');
                expect(query.orderBy).toBeCalledWith('id', 'ASC');
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
                        created: _now,
                        modified: _now,
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
                    created: _now,
                    modified: _now,
                });

                expect(item).toEqual({
                    id: 'id3', value: 'item3',
                    created: _now,
                    modified: _now,
                });
            });
    });

    pit('creates new item by insert with autoincrements', () => {
        query.then.mockImpl(
            (callback) => {
                query.then.mockImpl(
                    (callback) => Promise.resolve({
                        id: 4, value: 'item4',
                        created: _now,
                        modified: _now,
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
                    created: _now,
                    modified: _now,
                });

                expect(item).toEqual({
                    id: 4, value: 'item4',
                    created: _now,
                    modified: _now,
                });
            });
    });

    pit('updates item', () => {
        query.update = jest.fn().mockReturnValue(Promise.resolve({
            id: 'item6',
            value: 'valuevalue',
            modified: _now,
        }));

        return new Model('items')
            .update('item6', 'user6', {
                value: 'value6',
            })
            .then(() => {
                expect(query.where.mock.calls.length).toBe(2);
                expect(query.where.mock.calls[0]).toEqual([{
                    id: 'item6',
                    user_id: 'user6',
                }]);
                expect(query.where.mock.calls[1]).toEqual(['id', 'item6']);
                expect(query.update).toBeCalledWith({
                    value: 'value6',
                    modified: _now,
                });
            });
    });

    pit('updates not owned item', () => {
        query.update = jest.fn().mockReturnValue(Promise.resolve({
            id: 'item6',
            value: 'valuevalue',
            modified: _now,
        }));

        return new Model('items')
            .update('item6', 'user6', {
                value: 'value6',
            }, true)
            .then(() => {
                expect(query.where.mock.calls.length).toBe(2);
                expect(query.where.mock.calls[0]).toEqual([{
                    id: 'item6',
                }]);
                expect(query.where.mock.calls[1]).toEqual(['id', 'item6']);
                expect(query.update).toBeCalledWith({
                    value: 'value6',
                    modified: _now,
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
