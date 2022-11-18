/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const escape = require('escape-string-regexp');
const { getDefaultConfig } = require('@expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const utils = require('./scripts/utils.config');
const defaultConfig = getDefaultConfig(__dirname);
const root = utils.root;

module.exports = {
  ...defaultConfig,

  projectRoot: __dirname,
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    ...defaultConfig.resolver,

    // We need to exclude the peerDependencies we've collected in packages' node_modules
    blacklistRE: exclusionList(
      [].concat(
        ...utils.workspaces.map((it) =>
          utils.modules.map(
            (m) =>
              new RegExp(`^${escape(path.join(it, 'node_modules', m))}\\/.*$`)
          )
        )
      )
    ),

    // When we import a package from the monorepo, metro won't be able to find their deps
    // We need to specify them in `extraNodeModules` to tell metro where to find them
    extraNodeModules: utils.modules.reduce((acc, name) => {
      acc[name] = path.join(root, 'node_modules', name);
      return acc;
    }, {}),
  },

  server: {
    ...defaultConfig.server,

    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // When an asset is imported outside the project root, it has wrong path on Android
        // So we fix the path to correct one
        if (/\/packages\/.+\.png\?.+$/.test(req.url)) {
          req.url = `/assets/../${req.url}`;
        }

        return middleware(req, res, next);
      };
    },
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
