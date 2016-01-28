export const format = (fmt, data, nullToKey = true) =>
    fmt && fmt.replace(/\${[a-zA-Z_]+}/g, (s) => {
        const key = s.substr(0, s.length - 1).substr(2);
        const result = data && data[key];

        if (result === null && nullToKey) return key;
        return result || '';
    });