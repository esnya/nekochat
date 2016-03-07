require('nekodev').gulp({
    jest: {
        config: {
            unmockedModulePathPatterns: [
                'depd',
                'lodash',
                'react',
            ],
        },
    },
});