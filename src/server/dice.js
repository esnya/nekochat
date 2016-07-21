import { flatten } from 'lodash';
import * as NodeType from '../constants/NodeType';
// eslint-disable-next-line import/no-unresolved
import parser from '../pegjs/fluorite5';

const NUM_MAX = 9999;

const parseSimple = (str, results) =>
    str.replace(
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

                results.push([eye, r]);

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

const runFluorite5 = (formula, vm) => {
    const input = formula[0];
    try {
        const result = `${vm.toString(formula[1](vm, 'get', []))}`;
        return {
            type: NodeType.FLUORITE5,
            text: `{${input}}=${result}`,
            input,
            result,
        };
    } catch (error) {
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
        // [A, B, A, ... , B, A] A: Text, B: Flu5
        const parsed = parser.parse(str, {
            startRule: 'Expression',
        });
        const vm = new (parser.parse('standard', {
            startRule: 'VMFactory',
        }))();
        const results = [];

        const nodes = flatten(parsed.map((src, i) => {
            if (i % 2 === 0) {
                // Text
                return src.split(/\r\n|\n/)
                    .map(line => [{
                        type: NodeType.TEXT,
                        text: parseSimple(line, results),
                    }]);
            }

            // Flu5
            const node = runFluorite5(src, vm);
            return [[node]];
        }).slice(parsed[0] ? 0 : 1, parsed[parsed.length - 1] ? parsed.length : -1));

        return Promise.resolve({
            nodes,
            results,
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
