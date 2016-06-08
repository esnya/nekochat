describe('browser', () => {
    describe('character', () => {
        const axios = jest.fn();
        jest.setMock('axios', axios);

        jest.unmock('../character');
        const { get } = require('../character');

        pit('is to get chracter', () => {
            const url = 'http://example.com/path';
            const data = {
                name: 'Name',
                icon: 'icon.png',
            };
            axios.mockReturnValueOnce(Promise.resolve({ data }));

            return get(url)
                .then((character) => {
                    expect(character).toEqual({
                        url,
                        link: url,
                        ...data,
                    });
                });
        });

        pit('has cach', () => {
            const url = 'http://example.com/path';
            const data = {
                name: 'Name',
                icon: 'icon.png',
            };
            axios.mockClear();

            return get(url)
                .then((character) => {
                    expect(axios).not.toBeCalled();
                    expect(character).toEqual({
                        url,
                        link: url,
                        ...data,
                    });
                });
        });

        pit('requests only one session', () => {
            const url = 'http://example.com/path2';
            const data = {
                name: 'Name2',
                icon: 'icon.png',
            };
            let r1;
            const mock1 = new Promise((resolve) => (r1 = resolve));

            axios.mockClear();
            axios.mockReturnValue(mock1);

            const p1 = get(url);
            const p2 = get(url);

            expect(axios.mock.calls.length).toBe(1);

            r1({ data });

            return p1
                .then((c1) => {
                    expect(c1).toEqual({
                        url,
                        link: url,
                        ...data,
                    });

                    return p2;
                })
                .then((c2) => {
                    expect(c2).toEqual({
                        url,
                        link: url,
                        ...data,
                    });
                });
        });

        pit('reject not JSON', () => {
            const msg = 'err';

            axios.mockClear();
            axios.mockReturnValue(Promise.resolve({ data: msg }));

            return get('http://example.com/path3')
                .then(() => {
                    throw new Error('Should not be resolved');
                })
                .catch((e) => {
                    expect(e).toBe(msg);
                });
        });
    });
});
