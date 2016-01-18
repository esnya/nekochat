export const diceReplace = function (str, io) {
    return str.replace(/([0-9]*d[0-9]*|[0-9]+)([+-][0-9]*d[0-9]*|[+-][0-9]+)*=/g, function (exp) {
        var status = '';

        var diced = exp.replace(/([0-9]*)d([0-9]*)/g, function (dice) {
            var s = dice.split('d');
            var num = 1;
            var eye = 6;

            if (dice.charAt(0) == 'd') {
                eye = +s[0];
            } else {
                num = +s[0];
                if (s.length == 2 && s[1]) {
                    eye = +s[1];
                }
            }

            if (num > 9999) {
                return NaN;
            }

            var r = [];
            for (var i = 0; i < num; ++i) {
                r.push(Math.floor(Math.random() * eye + 1));
            }

            if (io) {
                io.emit('dice', eye, r);
            }

            if (num > 1) {
                if (r.every(function (n) {
                    return n == 1
                })) {
                    status = '(1ゾロ)';
                } else if (r.every(function (n) {
                    return n == eye
                })) {
                    status = '(' + eye + 'ゾロ)';
                }
            }

            return '[' + r.join(', ') + ']';
        });

        var sum = eval(diced.replace(/,/g, '+').replace(/[\[\] ]/g, '').slice(0, -1));

        return exp + diced + sum + status;
    });
};