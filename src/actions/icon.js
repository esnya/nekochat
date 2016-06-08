import { map } from 'lodash';
import { createAction } from 'redux-actions';

const sync = () => ({ sync: true });

export const CREATE = 'ICON_CREATE';
export const create = createAction(CREATE, (icon) => icon);

export const UPLOAD = 'ICON_UPLOAD';
export const upload = createAction(UPLOAD, (files) => map(files, (file) => ({
    name: file.name,
    type: file.type,
    data: file,
})), sync);

const removeMeta = (message) => () => ({
    dialog: {
        type: 'confirm',
        title: 'Delete Icon',
        message,
    },
    sync: true,
});

export const REMOVE = 'ICON_REMOVE';
export const remove =
    createAction(REMOVE, (icon) => icon, removeMeta('Delete icon "${name}"'));

export const BULK_REMOVE = 'ICON_BULK_REMOVE';
export const bulkRemove = createAction(
    BULK_REMOVE,
    (icons) => icons,
    removeMeta('Delete selected icons')
);

export const FETCH = 'ICON_FETCH';
export const fetch = createAction(FETCH, () => {}, sync);

export const LIST = 'ICON_LIST';
export const list = createAction(LIST, (icons) => icons);
