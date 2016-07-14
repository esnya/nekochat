describe('user', () => {
    const config = require('config');
    const { User } = require('../models/user');
    const { NOT_FOUND } = require('../models/model');

    jest.unmock('../user');
    const { getUser } = require('../user');

    pit('gets user from session', () => {
        const session = {
            passport: {
                user: 'user1',
            },
        };

        User.find.mockReturnValue(Promise.resolve({
            id: 'user1',
            name: 'User1',
        }));

        return getUser(session)
            .then((user) => {
                expect(User.find).toBeCalledWith('id', 'user1');
                expect(user).toEqual({
                    id: 'user1',
                    name: 'User1',
                });
            });
    });

    pit('gets guest user', () => {
        config.get.mockReturnValue(true);
        User.find.mockReturnValue(Promise.reject(NOT_FOUND));


        const session = {
            passport: {
                user: 'guest',
            },
            guest: {
                id: 'guest',
                name: 'Guest',
            },
        };

        return getUser(session)
            .then((user) => {
                expect(user).toEqual({
                    id: 'guest',
                    name: 'Guest',
                });
            });
    });
});
