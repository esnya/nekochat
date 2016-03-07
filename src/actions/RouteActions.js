import * as ROUTE from '../constants/RouteActions';

export const set = function(path, e = null) {
    if (!e || !(e.nativeEvent instanceof MouseEvent) || (
        e.nativeEvent.button === 0 && !e.nativeEvent.ctrlKey
    )) {
        if (e) e.preventDefault();

        return {
            type: ROUTE.SET,
            path,
        };
    }

    return {
        type: 'NONE',
    };
};
