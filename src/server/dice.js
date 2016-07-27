import { flatten } from 'lodash';
import { getLogger } from 'log4js';
import * as NodeType from '../constants/NodeType';
// eslint-disable-next-line import/no-unresolved
import parser from '../pegjs/fluorite5';
import { parseMods } from './flu5mods';

const logger = getLogger('[dice]');
const NUM_MAX = 9999;

const parseSimple = (str, results = []) => {
    const text = str.replace(
        /([0-9]*d[0-9]*|[0-9]+)([+-][0-9]*d[0-9]*|[+-][0-9]+)*=/g,
        (exp) => {
            let status = '';

            const diced = exp.replace(/([0-9]*)d([0-9]*)/g, (dice) => {
                const s = dice.split('d');
                let num = 1;
                let eye = 6;

                if (dice.charAt(0) === 'd') {
                    eye = +s[0];
                } else {
                    num = +s[0];
                    if (s.length === 2 && s[1]) {
                        eye = +s[1];
                    }
                }

                if (num > NUM_MAX) {
                    return NaN;
                }

                const r = [];

                for (let i = 0; i < num; ++i) {
                    r.push(Math.floor(Math.random() * eye + 1));
                }

                results.push({ faces: eye, results: r });

                if (num > 1) {
                    if (r.every((n) => n === 1)) {
                        status = '(1ゾロ)';
                    } else if (r.every((n) => n === eye)) {
                        status = `(${eye}ゾロ)`;
                    }
                }

                return `[${r.join(', ')}]`;
            });

            // eslint-disable-next-line no-eval
            const sum = eval(
                diced
                    .replace(/,/g, '+')
                    .replace(/[\[\] ]/g, '')
                    .slice(0, 0 - 1)
            );

            return exp + diced + sum + status;
        }
    );

    return { text, results };
};

const runFluorite5 = (formula, vm) => {
    const input = formula[0];
    try {
        const result = `${vm.toString(formula[1](vm, 'get', []))}`;

        return {
            type: NodeType.FLUORITE5,
            text: `{${input}}=${result}`,
            input,
            result,
            dice: vm.dices,
        };
    } catch (error) {
        logger.error(error);

        return {
            type: NodeType.FLUORITE5_ERROR,
            text: `[Error: ${error}]`,
            input,
            error,
        };
    }
};

export const diceReplace = (str) => {
    try {
        // ['text', ['flu5', function], ['flu5', function], 'text', ...]
        const parsed = parser.parse(str, {
            startRule: 'Expression',
        });
        const vm = new (parser.parse('standard', {
            startRule: 'VMFactory',
        }))();

        const { error } = runFluorite5(parseMods(), vm);
        if (error) {
            logger.error(error);
        }

        const dice = [];

        const nodes = parsed.map(line =>
            line.map(src => {
                if (typeof(src) === 'string') {
                    const {
                        text,
                        results,
                    } = parseSimple(src);

                    dice.push(results);

                    const type = results.length === 0
                        ? NodeType.TEXT
                        : NodeType.SIMPLE_DICE;

                    return {
                        type,
                        text,
                        dice: results,
                    };
                }

                vm.dices = [];
                const node = runFluorite5(src, vm);
                dice.push(node.dice);
                return node;
            })
        );

        return Promise.resolve({
            nodes,
            results: flatten(dice),
        });
    } catch (error) {
        return Promise.resolve({
            nodes: [[{
                type: NodeType.FLUORITE5_ERROR,
                text: error.toString(),
                error,
            }]],
            results: [],
        });
    }
};
