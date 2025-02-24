const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
    alias({
        '@components': 'src/components',
        '@atom': 'src/components/atom',
        '@pages': 'src/components/pages',
        // '@api': 'src/api',
        '@layouts': 'src/layouts',
        '@routes': 'src/routes',
        '@images': 'src/assets/images',
        '@icons': 'src/assets/icons',
        '@setup': 'src/setup',
        '@redux': 'src/redux',
        '@styles': 'src/styles',
        '@common': 'src/common',
        '@ultils': 'src/ultils',
        '@context': 'src/context',
    })(config);

    return config;
};
