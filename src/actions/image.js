export const UPLOAD = 'IMAGE_UPLOAD';
export const upload = (name, blob) => ({
    type: UPLOAD,
    name,
    fileType: blob.type,
    blob,
});
