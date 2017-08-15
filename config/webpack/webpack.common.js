const webpack = require("webpack");
const helpers = require("./../helpers");

/**
 * Webpack Plugins
 *
 * problem with copy-webpack-plugin
 */
// See: https://github.com/kossnocorp/assets-webpack-plugin
const AssetsPlugin = require("assets-webpack-plugin");

const NormalModuleReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin");
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlElementsPlugin = require("./../html-elements-plugin/index");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
// const PreloadWebpackPlugin = require('preload-webpack-plugin');

/**
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag("hot");
const AOT = false;
const METADATA = {
  title: "Fleetwise",
  baseUrl: "/",
  isDevServer: helpers.isWebpackDevServer(),
  HMR,
};

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {
  const isProd = options.env === "production";
  return {
    /**
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * See: http://webpack.github.io/docs/configuration.html#cache
     */
    // cache: false,

    /**
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
      polyfills: "./src/polyfills.browser.js",
      main: ["./src/main.browser.js", "bootstrap-loader"],
    },

    /**
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {
      /*
       * See: https://webpack.js.org/configuration/resolve/#resolve-alias
       */
      alias: {
        core: helpers.root("src", "app/core"),
        guards: helpers.root("src", "app/core/auth/guards"),
      },

      /**
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: [".js", ".json"],

      /**
       * An array of directory names to be resolved to the current directory
       */
      modules: [helpers.root("src"), helpers.root("node_modules")],
    },

    /**
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {
      rules: [
        /**
         * ESlint loader
         * This loader will output errors based on the .eslintrc file
         * See: https://github.com/MoOx/eslint-loader
         */
        {
          test: /\.js$/,
          enforce: "pre",
          loader: "eslint-loader",
          options: {
            cache: true,
            /**
             * Be careful: this option might cause webpack to enter an infinite build loop
             * if some issues cannot be fixed properly.
             */
            fix: true,
          },
          include: [helpers.root("src/app/")],
          exclude: [/\.(spec|e2e)\.js$/, /(assets)/],
        },

        /**
         * Babel loader support for .js
         *
         * Component Template/Style integration using `angular2-template-loader`
         * Angular 2 lazy loading (async routes) via `ng-router-loader`
         *
         * `ng-router-loader` expects vanilla JavaScript code, not ES6 code. This is why the
         * order of the loader matter.
         *
         * See: https://github.com/babel/babel-loader
         * See: https://github.com/TheLarkInn/angular2-template-loader
         * See: https://github.com/shlomiassaf/ng-router-loader
         */
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              query: {
                presets: [["es2015", { modules: false }], "angular2"],
              },
            },
            {
              loader: "angular2-template-loader",
            },
            {
              loader: "@angularclass/hmr-loader",
              options: {
                pretty: !isProd,
                prod: isProd,
              },
            },
            {
              /**
               *  MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
               */
              loader: "ng-router-loader",
              options: {
                loader: "async-import",
                genDir: "compiled",
                aot: AOT,
              },
            },
          ],
          include: [helpers.root("src/")],
          exclude: [/\.(spec|e2e)\.js$/, /(assets)/],
        },

        /**
         * Json loader support for *.json files.
         *
         * See: https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          use: "json-loader",
        },

        /**
         * To string and css loader support for *.css files (from Angular components)
         * Returns file content as string
         *
         */
        {
          test: /\.css$/,
          use: ["to-string-loader", "css-loader", "postcss-loader"],
          exclude: [helpers.root("src", "styles")],
        },

        /**
         * To string and sass loader support for *.scss files (from Angular components)
         * Returns compiled css content as string
         * TODO: when windows support for sass-resources-loader is added, resources should be one file
         */
        {
          test: /\.scss$/,
          use: [
            "to-string-loader",
            "css-loader",
            "postcss-loader?sourceMap",
            "resolve-url-loader",
            "sass-loader?sourceMap",
            {
              loader: "sass-resources-loader",
              options: {
                resources: [
                  helpers.root("src", "styles/resources/**/*.scss"),
                  helpers.root(
                    "node_modules",
                    "bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss"
                  ),
                  helpers.root(
                    "node_modules",
                    "bootstrap-sass/assets/stylesheets/bootstrap/mixins/*.scss"
                  ),
                ],
              },
            },
          ],
          exclude: [helpers.root("src", "styles")],
        },

        /**
         * Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          use: "raw-loader",
          exclude: [helpers.root("src/index.html")],
        },

        /**
         * loader support for *.pug
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.(pug)$/,
          use: ["raw-loader", {loader: "pug-html-loader", options: {doctype: 'html'}}],
        },

        /**
         * File loader for supporting images, for example, in CSS files.
         */
        {
          test: /\.(jpg|png|gif)$/,
          use: "file-loader",
        },

        /* File loader for supporting fonts, for example, in CSS files.
         */
        {
          test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
          use: "file-loader",
        },
      ],
    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      // Use for DLLs
      // new AssetsPlugin({
      //   path: helpers.root('dist'),
      //   filename: 'webpack-assets.json',
      //   prettyPrint: true
      // }),

      /**
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      new CommonsChunkPlugin({
        name: "polyfills",
        chunks: ["polyfills"],
      }),
      /**
       * This enables tree shaking of the vendor modules
       */
      // new CommonsChunkPlugin({
      //   name: 'vendor',
      //   chunks: ['main'],
      //   minChunks: module => /node_modules/.test(module.resource)
      // }),
      /**
       * Specify the correct order the scripts will be injected in
       */
      // new CommonsChunkPlugin({
      //   name: ['polyfills', 'vendor'].reverse()
      // }),
      // new CommonsChunkPlugin({
      //   name: ['manifest'],
      //   minChunks: Infinity,
      // }),

      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
       */
      new ContextReplacementPlugin(
        /**
         * The (\\|\/) piece accounts for path separators in *nix and Windows
         */
        /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root("src"), // location of your src
        {
          /**
           * Your Angular Async Route paths relative to this root directory
           */
        }
      ),

      /**
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
      new CopyWebpackPlugin(
        [{ from: "src/assets", to: "assets" }, { from: "src/meta" }],
        isProd ? { ignore: ["mock-data/**/*"] } : undefined
      ),

      /*
       * Plugin: PreloadWebpackPlugin
       * Description: Preload is a web standard aimed at improving
       * performance and granular loading of resources.
       *
       * See: https://github.com/GoogleChrome/preload-webpack-plugin
       */
      // new PreloadWebpackPlugin({
      //  rel: 'preload',
      //  as: 'script',
      //  include: ['polyfills', 'vendor', 'main'].reverse(),
      //  fileBlacklist: ['.css', '.map']
      // }),
      // new PreloadWebpackPlugin({
      //  rel: 'prefetch',
      //  as: 'script',
      //  include: 'asyncChunks'
      // }),

      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin({
        template: "src/index.html",
        title: METADATA.title,
        chunksSortMode: "dependency",
        metadata: METADATA,
        inject: "body",
      }),
      
      
      /**
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        sync: /polyfills|vendor/,
        defaultAttribute: "async",
        preload: [/polyfills|vendor|main/],
        prefetch: [/chunk/],
      }),

      /**
       * Plugin: HtmlElementsPlugin
       * Description: Generate html tags based on javascript maps.
       *
       * If a publicPath is set in the webpack output configuration, it will be automatically added to
       * href attributes, you can disable that by adding a "=href": false property.
       * You can also enable it to other attribute by settings "=attName": true.
       *
       * The configuration supplied is map between a location (key) and an element definition object (value)
       * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
       *
       * Example:
       *  Adding this plugin configuration
       *  new HtmlElementsPlugin({
       *    headTags: { ... }
       *  })
       *
       *  Means we can use it in the template like this:
       *  <%= webpackConfig.htmlElements.headTags %>
       *
       * Dependencies: HtmlWebpackPlugin
       */
      new HtmlElementsPlugin({
        headTags: require("./../head-config.common.js"),
      }),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({}),

      /**
       * Globally recognize variables as a module
       * for example _ as lodash or $ as jquery
       */
      // new webpack.ProvidePlugin({
      //   Jquery: "jquery",
      // }),

      /**
       * Plugin: InlineManifestWebpackPlugin
       * Inline Webpack's manifest.js in index.html
       *
       * https://github.com/szrenwei/inline-manifest-webpack-plugin
       */
      new InlineManifestWebpackPlugin(),
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: "empty",
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false,
    },
  };
};
