describe('dice', () => {
    jest.autoMockOff();
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

    pit('fluorite5 script', () => {
        return diceReplace('\\1 + 20 - 7 * 2\\ '
                + '\\$a = 100; $a * 10\\ '
                + '\\"text".length()\\ '
                + '\\1 ~ 3 --> $_ * 2 => "|".join\\ ')
            .then((result) => {
                expect(result.results).toEqual([
                ]);
                expect(result.message)
                    .toEqual(
                        '{1 + 20 - 7 * 2}=7 '
                            + '{$a = 100; $a * 10}=1000 '
                            + '{"text".length()}=4 '
                            + '{1 ~ 3 --> $_ * 2 => "|".join}=2|4|6 '
                    );
            });
    });
});
