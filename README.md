# Framework33

A simple CSS and ECMA Script framework. Includes multiple CSS grids, animation system and 'in view' detection, as well as two way data binding for creating dynamic HTML using the Observable-slim module. All wrapped up in a Webpack dev environment.

## Color

Color and image manipulation are possibly the main reasons for using this framework. Multiple pre-defined colors and gradients, along with blending, make it easy to create multi-layered graphics that are rendered in real time. Rather than relying on your photo editing software to get the background you want, you can simply add classes to render the filters, layers and blends directly in the browser.

## Grids

Framework33 comes with 2 main grid class sets, using CSS Grid and regular CSS Block styling. Flexbox is also used but mainly for internal positioning, rather than overall layout, and floats are explicitly absent.

## Dynamic HTML

Much like AngularJS and Vue, Framework33 offers functions for creating dynamic HTML with 2 way binding, DOM manipulation and click handlers. It only offers a very limited subset of functions, but that means it's very light weight and it's really simple to pick up. Just enough to make your pages come alive.

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
