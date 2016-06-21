import path from 'path';
import { readFileSync } from 'fs';
import PEG from 'pegjs';

const NUM_MAX = 9999;

const data = readFileSync(path.join(__dirname, '../../pegjs/fluorite5.pegjs'));

// eslint-disable-next-line no-sync
const parser = PEG.buildParser(data.toString(), {
    cache: true,
    allowedStartRules: [
        "Expression",
        "VMFactory",
    ],
});

const parseSimple = function (str, results) {
    return str.replace(
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
                    if (r.every((n) => n ===1)) {
                        status = '(1ゾロ)';
                    } else if (r.every((n) => n === eye)) {
                        status = '(' + eye + 'ゾロ)';
                    }
                }

                return '[' + r.join(', ') + ']';
            });

            const sum = eval(
                diced
                    .replace(/,/g, '+')
                    .replace(/[\[\] ]/g, '')
                    .slice(0, 0 - 1)
            );

            return exp + diced + sum + status;
        }
    );
};

const runFluorite5 = function (messages, formula, vm) {
    messages.push("{");
    messages.push(formula[0]);
    messages.push("}=");
    try {
        messages.push(vm.toString(formula[1](vm, "get", [])));
    } catch (e) {
        messages.push("[Error: " + e + "]");
    }
};

export const diceReplace = function (str) {
    // [A, B, A, ... , B, A] A: Text, B: Flu5
    const array = parser.parse(str, {
        startRule: "Expression",
    });
    const vm = new (parser.parse("standard", {
        startRule: "VMFactory",
    }))();
    const results = [];
    const messages = [];
    let i;

    for (i = 0; i < array.length; i++) {
        if (i % 2 === 0) {
            // Text
            messages.push(parseSimple(array[i], results));
        } else {
            // Flu5
            runFluorite5(messages, array[i], vm);
        }
    }

    return Promise.resolve({
        message: messages.join(""),
        results,
    });
};
