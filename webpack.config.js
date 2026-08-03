const defaultConfig = require("@wordpress/scripts/config/webpack.config.js");
const path = require("path");

// import ESLintPlugin from "eslint-webpack-plugin";
const ESLintPlugin = require("eslint-webpack-plugin");

const plugins = defaultConfig.plugins.filter((p) => {
  if (Object.values(p).length === 2 && Object.values(p)?.[1]["filename"] && Object.values(p)?.[1]["filename"] === "[name]-rtl.css") {
    return false;
  }
  return true;
});

const entry = {
  ...defaultConfig.entry(),
  admin: "./src/admin.ts",
  dashboard: "./src/dashboard/admin.js",
  onboarding: "./src/dashboard/onboarding.js",
  "blocks/blocks": "./src/blocks/blocks.ts",
  "blocks/view": "./src/blocks/view.tsx",
};

module.exports = {
  ...defaultConfig,
  entry,
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve?.alias,
      src: path.resolve(__dirname, "src"),
    },
  },
  plugins: [...plugins, new ESLintPlugin()],
  optimization: {},
};
