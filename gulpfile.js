require('nekodev').gulp({
    jest: {
        config: {
            unmockedModulePathPatterns: [
                'depd',
                'body-parser',
                'lodash',
                'react',
            ],
        },
    },
});
