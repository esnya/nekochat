export const bindState = (...bindings) => (state) =>
    bindings.map((key) => [key, state[key]])
        .reduce((o, v) => {
            o[v[0]] = v[1];
            return o;
        }, {});

export const bindActions = (bindings) => (dispatch) =>
     Object.keys(bindings)
        .map((key) => [key, (...args) => dispatch(bindings[key](...args))])
        .reduce((o, v) => {
            o[v[0]] = v[1];
            return o;
        }, {});