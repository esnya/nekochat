describe('dice', () => {
    jest.autoMockOff();
    const _ = require('lodash');
    const NodeType = require('../../constants/NodeType');

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
            .then(({ nodes, results }) => {
                expect(results).toEqual([
                    { faces: 6, results: [6, 5] },
                ]);
                expect(nodes.length).toBe(1);
                expect(nodes[0].length).toBe(1);
                expect(nodes[0][0].type).toEqual(NodeType.SIMPLE_DICE);
                expect(nodes[0][0].text).toEqual('The test with 2d+5=[6, 5]+5=16,1d6 (dice expr)');
                expect(nodes[0][0].dice).toEqual([
                    { faces: 6, results: [6, 5] },
                ]);
            });
    });

    it('parses fluorite5 script', () =>
        Promise.all(
            [
                '\\1 + 20 - 7 * 2\\',
                '\\$a = 100; $a * 10\\',
                '\\"text".length()\\',
                '\\1 ~ 3 --> $_ * 2 => "|".join\\',
            ].map(diceReplace)
        ).then((results) => {
            const expects = [
                '{1 + 20 - 7 * 2}=7',
                '{$a = 100; $a * 10}=1000',
                '{"text".length()}=4',
                '{1 ~ 3 --> $_ * 2 => "|".join}=2|4|6',
            ];

            expect(results.length).toBe(expects.length);
            _.zip(results, expects).forEach(([result, text]) => {
                const { nodes } = result;
                expect(nodes.length).toBe(1);
                expect(nodes[0].length).toBe(1);

                const node = nodes[0][0];
                expect(node.type).toEqual(NodeType.FLUORITE5);
                expect(node.text).toEqual(text);
            });
        })
    );

    it('parses lines', () =>
        diceReplace('line1\nline2\nline3')
            .then(({ nodes }) => {
                expect(nodes).toEqual([
                    [{ type: NodeType.TEXT, text: 'line1', dice: [] }],
                    [{ type: NodeType.TEXT, text: 'line2', dice: [] }],
                    [{ type: NodeType.TEXT, text: 'line3', dice: [] }],
                ]);
            })
    );

    it('parses lines with fluorite5 script', () =>
        diceReplace('line1\nline2a\\1 + 20\\line2b\nline3')
            .then(({ nodes }) => {
                expect(nodes.length).toBe(5);
                expect(nodes[0].length).toBe(1);
                expect(nodes[1].length).toBe(1);
                expect(nodes[2].length).toBe(1);
                expect(nodes[3].length).toBe(1);
                expect(nodes[4].length).toBe(1);
                expect(nodes[0][0].type).toEqual(NodeType.TEXT);
                expect(nodes[1][0].type).toEqual(NodeType.TEXT);
                expect(nodes[2][0].type).toEqual(NodeType.FLUORITE5);
                expect(nodes[3][0].type).toEqual(NodeType.TEXT);
                expect(nodes[4][0].type).toEqual(NodeType.TEXT);
                expect(nodes[0][0].text).toEqual('line1');
                expect(nodes[1][0].text).toEqual('line2a');
                expect(nodes[2][0].text).toEqual('{1 + 20}=21');
                expect(nodes[3][0].text).toEqual('line2b');
                expect(nodes[4][0].text).toEqual('line3');
            })
    );

    it('handles syntax error', () =>
        diceReplace('\\1 * \\')
            .then(({ nodes }) => {
                expect(nodes.length).toBe(1);
                expect(nodes[0].length).toBe(1);
                expect(nodes[0][0].type).toEqual(NodeType.FLUORITE5_ERROR);
                expect(nodes[0][0].text).toEqual(nodes[0][0].error.toString());
            })
    );

    it('returns results of dice with fluorite5', () => {
        Math.random
            .mockReturnValueOnce(5 / 6)
            .mockReturnValueOnce(4 / 6);

        return diceReplace('\\2d+5\\')
            .then(({ nodes, results }) => {
                expect(results).toEqual([
                    { faces: 6, results: [6, 5] },
                ]);
                expect(nodes[0][0].type).toEqual(NodeType.FLUORITE5);
                expect(nodes[0][0].text).toEqual('{2d+5}=16');
                expect(nodes[0][0].dice).toEqual([
                    { faces: 6, results: [6, 5] },
                ]);
            });
    });

    it('parses fluorite5 extended script', () =>
        diceReplace('\\$K20[10]\\')
            .then(({ nodes }) => {
                expect(nodes.length).toBe(1);
                expect(nodes[0].length).toBe(1);

                const node = nodes[0][0];
                expect(node.type).toEqual(NodeType.FLUORITE5);
                expect(node.text).toEqual('{$K20[10]}=8');
            })
    );
});
