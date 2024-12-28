const config = require('./tsconfig.json');

const { baseUrl, paths } = config.compilerOptions;

const getAliases = () => {
  return Object.entries(paths).reduce((aliases, alias) => {
    const key = alias[0].replace('/*', '');
    const value = alias[1][0].replace('*', '');
    console.log(key, value)
    return {
      ...aliases,
      [key]: value,
    };
  }, {});
};

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        alias: getAliases(),
      },
    ],
  ],
};
