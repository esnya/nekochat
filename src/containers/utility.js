export const bindState = (...keys) => (state) =>
    keys.reduce((result, key) => {
        const m = key.match(/^\.{3}(.*)$/);

        if (m) {
            Object.assign(result, state[m[1]]);
        } else {
            result[key] = state[key];
        }

        return result;
    }, {});

export const bindActions = (bindings) => (dispatch) =>
     Object
        .keys(bindings)
        .map((key) => [key, (...args) => dispatch(bindings[key](...args))])
        .reduce((o, v) => {
            o[v[0]] = v[1];

            return o;
        }, {});
