export const diceReplace = function (str, io) {
    return str.replace(/([0-9]*d[0-9]*|[0-9]+)([+-][0-9]*d[0-9]*|[+-][0-9]+)*=/g, (exp) => {
        let status = '';

        let diced = exp.replace(/([0-9]*)d([0-9]*)/g, (dice) => {
            let s = dice.split('d');
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

            if (num > 9999) {
                return NaN;
            }

            let r = [];
 
            for (let i = 0; i < num; ++i) {
                r.push(Math.floor(Math.random() * eye + 1));
            }

            if (io) {
                io.emit('dice', eye, r);
            }

            if (num > 1) {
                if (r.every((n) => n ===1)) {
                    status = '(1ゾロ)';
                } else if (r.every((n) => n === eye)) {
                    status = '(' + eye + 'ゾロ)';
                }
            }

            return '[' + r.join(', ') + ']';
        });

        let sum = eval(diced.replace(/,/g, '+').replace(/[\[\] ]/g, '').slice(0, -1));

        return exp + diced + sum + status;
    });
};