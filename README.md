# Framework33

A simple CSS and ECMA Script framework. Includes multiple CSS grids, animation system and 'in view' detection, as well as two way data binding for creating dynamic HTML using the Observable-slim module. All wrapped up in a Webpack dev environment.

## Color

Color and image manipulation is also a main focus for this project. Multiple pre-defined colors and gradients, along with blending, make it easy to create multi-layered graphics that are rendered in real time. Rather than relying on your photo editing software to get the background you want, you can simply add classes to render the filters, layers and blends directly in the browser.

### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

### Features:

* ES6 Support via [babel](https://babeljs.io/) (v7)
* SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
* Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.
