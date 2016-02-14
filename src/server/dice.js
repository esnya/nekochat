const NUM_MAX = 9999;

export const diceReplace = function (str) {
    const results = [];

    const replaced = str.replace(
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

    return Promise.resolve({
        message: replaced,
        results,
    });
};