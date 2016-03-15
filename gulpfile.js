require('nekodev').gulp({
    jest: {
        config: {
            unmockedModulePathPatterns: [
                'bluebird',
                'body-parser',
                'depd',
                'lodash',
                'react',
            ],
        },
    },
});
