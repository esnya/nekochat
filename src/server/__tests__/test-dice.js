describe('dice', () => {
    jest.autoMockOff();
    const _ = require('lodash');
    const NodeType = require('../../constants/NodeType');

    const parseDice = require('../dice').parseDice;

    let random;
    beforeEach(() => {
        random = Math.random;
        Math.random = jest.fn();
    });
    afterEach(() => {
        Math.random = random;
    });

    it('replaces dice', () => {
        Math.random
            .mockReturnValueOnce(5 / 6)
            .mockReturnValueOnce(4 / 6);

        const { nodes, results } = parseDice('The test with 2d+5=,1d6 (dice expr)');

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

    it('parses fluorite5 script', () => {
        const results = [
            '\\1 + 20 - 7 * 2\\',
            '\\$a = 100; $a * 10\\',
            '\\"text".length()\\',
            '\\1 ~ 3 --> $_ * 2 => "|".join\\',
        ].map(message => parseDice(message));

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
    });

    it('parses lines', () => {
        const { nodes } = parseDice('line1\nline2\nline3');

        expect(nodes).toEqual([
            [{ type: NodeType.TEXT, text: 'line1', dice: [] }],
            [{ type: NodeType.TEXT, text: 'line2', dice: [] }],
            [{ type: NodeType.TEXT, text: 'line3', dice: [] }],
        ]);
    });

    it('parses lines with fluorite5 script', () => {
        const { nodes } = parseDice('line1\nline2a\\1 + 20\\line2b\nline3');

        expect(nodes.length).toBe(3);
        expect(nodes[0].length).toBe(1);
        expect(nodes[0][0].type).toEqual(NodeType.TEXT);
        expect(nodes[0][0].text).toEqual('line1');

        expect(nodes[1].length).toBe(3);
        expect(nodes[1][0].type).toEqual(NodeType.TEXT);
        expect(nodes[1][0].text).toEqual('line2a');
        expect(nodes[1][1].type).toEqual(NodeType.FLUORITE5);
        expect(nodes[1][1].text).toEqual('{1 + 20}=21');
        expect(nodes[1][2].type).toEqual(NodeType.TEXT);
        expect(nodes[1][2].text).toEqual('line2b');

        expect(nodes[2].length).toBe(1);
        expect(nodes[2][0].type).toEqual(NodeType.TEXT);
        expect(nodes[2][0].text).toEqual('line3');
    });

    it('handles syntax error', () => {
        const { nodes } = parseDice('\\1 * \\');

        expect(nodes.length).toBe(1);
        expect(nodes[0].length).toBe(1);
        expect(nodes[0][0].type).toEqual(NodeType.FLUORITE5_ERROR);
        expect(nodes[0][0].text).toEqual(nodes[0][0].error.toString());
    });

    it('returns results of dice with fluorite5', () => {
        Math.random
            .mockReturnValueOnce(5 / 6)
            .mockReturnValueOnce(4 / 6);

        const { nodes, results } = parseDice('\\2d+5\\');

        expect(results).toEqual([
            { faces: 6, results: [6, 5] },
        ]);
        expect(nodes[0][0].type).toEqual(NodeType.FLUORITE5);
        expect(nodes[0][0].text).toEqual('{2d+5}=16');
        expect(nodes[0][0].dice).toEqual([
            { faces: 6, results: [6, 5] },
        ]);
    });

    it('parses fluorite5 extended script', () => {
        const { nodes } = parseDice('\\$K20[10]\\');

        expect(nodes.length).toBe(1);
        expect(nodes[0].length).toBe(1);

        const node = nodes[0][0];
        expect(node.type).toEqual(NodeType.FLUORITE5);
        expect(node.text).toEqual('{$K20[10]}=8');
    });
});
