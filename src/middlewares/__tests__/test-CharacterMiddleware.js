describe('CharacterMiddleware', () => {
    const xhr = require('../../browser/xhr');

    jest.dontMock('../../actions/CharacterActions');
    const Action = require('../../actions/CharacterActions');

    jest.dontMock('../CharacterMiddleware');
    const middleware = require('../CharacterMiddleware').characterMiddleWare;

    const store = {
        dispatch: jest.genMockFn(),
        getState: jest.genMockFn(),
    };
    const next = jest.genMockFn();
    const mockPromise = {
        then: jest.genMockFn(),
        catch: jest.genMockFn(),
    };
    beforeEach(() => {
        store.dispatch.mockClear();
        store.getState.mockClear();
        next.mockClear();
        xhr.get.mockClear();
        mockPromise.then.mockClear();
        mockPromise.catch.mockClear();
        xhr.get.mockReturnValue(mockPromise);
        mockPromise.then.mockReturnValue(mockPromise);
        mockPromise.catch.mockReturnValue(mockPromise);
    });

    it('sends xhr by action get', () => {
        store.getState.mockReturnValue({
            characters: {},
        });

        middleware(store)(next)(
            Action.get('http://example.com/the/test/character.json')
        );

        expect(xhr.get)
            .toBeCalledWith('http://example.com/the/test/character.json');

        mockPromise
            .then
            .mock
            .calls
            .forEach(([then]) => then({
                name: 'Test-Name',
                url: 'http://example.com/the/test/character',
            }));

        expect(store.dispatch).toBeCalled();

        const action = store.dispatch.mock.calls[0][0];
        const expected = Action.set(
            'http://example.com/the/test/character.json',
            {
                name: 'Test-Name',
                url: 'http://example.com/the/test/character',
            }
        );

        expect(action.url).toEqual(expected.url);
        expect(action.data).toEqual(expected.data);
    });

    it('caches data', () => {
        store.getState.mockReturnValue({
            characters: {
                'http://example.com/the/test/character.json': {
                    data: { name: 'Test' },
                },
            },
        });

        middleware(store)(next)(
            Action.get('http://example.com/the/test/character.json')
        );

        expect(xhr.get).not.toBeCalled();
        expect(store.dispatch).not.toBeCalled();
    });
});
