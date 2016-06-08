import {createAction} from 'redux-actions';
// import {parse} from '../router/Parser';

export const SET = 'ROUTE_SET';
export const set = createAction(SET, (path, e = null) => {
    if (!e || !(e.nativeEvent instanceof MouseEvent) || (
        e.nativeEvent.button === 0 && !e.nativeEvent.ctrlKey
    )) {
        if (e) e.preventDefault();

        return {
            path,
        };
    }

    return new Error();
});
