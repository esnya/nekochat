describe('Room', () => {
    const { Model } = require('./model');

    jest.dontMock('./room');
    const {
        PASSWORD_INCORRECT,
        Room,
    } = require('./room');

    const {
        find,
        findAll,
    } = Model.prototype;

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('rooms');
    });

    it('lists all rooms', () => {
        findAll.mockClear();
        findAll.mockReturnValueOnce(Promise.resolve([
            { id: 'id1', title: 'title1', password: null },
            { id: 'id2', title: 'title2', password: 'p' },
            { id: 'id3', title: 'title3', password: null },
        ]));

        return Room
            .findAll()
            .then((rooms) => {
                expect(rooms).toEqual([
                    { id: 'id1', title: 'title1', password: false },
                    { id: 'id2', title: 'title2', password: true },
                    { id: 'id3', title: 'title3', password: false },
                ]);
                expect(findAll).toBeCalled();
            });
    });

    it('finds room', () => {
        find.mockClear();
        find.mockReturnValueOnce(Promise.resolve({
            id: 'id4', title: 'title4', password: 'pass',
        }));

        return Room
            .find('id', 'id4')
            .then((room) => {
                expect(room).toEqual({
                    id: 'id4', title: 'title4', password: true,
                });
                expect(find).toBeCalledWith('id', 'id4');
            });
    });

    it('accepts to join into room', () => {
        find.mockClear();
        find.mockReturnValueOnce(Promise.resolve({
            id: 'id5', title: 'title5', password: null,
        }));

        return Room
            .join('id5')
            .then((room) => {
                expect(room).toEqual({
                    id: 'id5', title: 'title5', password: false,
                });
                expect(find).toBeCalledWith('id', 'id5');
            })
            .catch((e) => {
                throw e;
            });
    });

    it('accepts to join into room with password', () => {
        find.mockClear();
        find.mockReturnValueOnce(Promise.resolve({
            id: 'id6', title: 'title6', password: 'pwd',
        }));

        return Room
            .join('id6', 'pwd')
            .then((room) => {
                expect(room).toEqual({
                    id: 'id6', title: 'title6', password: true,
                });
                expect(find).toBeCalledWith('id', 'id6');
            })
            .catch((e) => {
                throw e;
            });
    });

    it('rejects to join into room with incorrect password', () => {
        find.mockClear();
        find.mockReturnValueOnce(Promise.resolve({
            id: 'id7', title: 'title7', password: 'pass',
        }));

        return Room
            .join('id7', 'pwd')
            .then(() => Promise.reject('it should not be resolved'))
            .catch((e) => {
                expect(e).toEqual(PASSWORD_INCORRECT);
            });
    });
});
