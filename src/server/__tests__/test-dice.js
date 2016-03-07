describe('dice', () => {
    jest.dontMock('../dice');
    const diceReplace = require('../dice').diceReplace;

    let random;
    beforeEach(() => {
        random = Math.random;
        Math.random = jest.genMockFn();
    });
    afterEach(() => {
        Math.random = random;
    });

    pit('replaces dice', () => {
        Math.random
            .mockReturnValueOnce(5 / 6)
            .mockReturnValueOnce(4 / 6);

        return diceReplace('The test with 2d+5=,1d6 (dice expr)')
            .then((result) => {
                expect(result.results).toEqual([
                    [6, [6, 5]],
                ]);
                expect(result.message)
                    .toEqual(
                        'The test with 2d+5=[6, 5]+5=16,1d6 (dice expr)'
                    );
            });
    });
});
