module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src/'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src/',
          'screens': './src/screens/',
          'components': './src/components', // Corrected typo in the alias
        },
      },
    ],
    'react-native-reanimated/plugin', // Add this line to include the Reanimated plugin
  ],
};
