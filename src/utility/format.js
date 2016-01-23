export const format = (fmt, data) =>
    fmt.replace(/\${[a-zA-Z_]+}/g, (s) => {
        const key = s.substr(0, s.length - 1).substr(2);

        return data && data[key] || key;
    });