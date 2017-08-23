export const readAsArrayBuffer = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onabort = reject;
        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    });
};

export const readAsBlob =
    file => readAsArrayBuffer(file)
        .then(
            buffer => new Blob([buffer], { type: file.type, name: file.name }),
        );
