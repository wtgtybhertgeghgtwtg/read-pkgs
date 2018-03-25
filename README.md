# read-pkgs

> Read `package.json` in directories that match a glob pattern.

Glob a bunch of directories and then run them through [read-pkg](https://github.com/sindresorhus/read-pkg).

## Install

```
$ yarn add read-pkgs
```

## Usage

```js
const readPkgs = require('read-pkgs');

readPkgs('packages/*').then(pkgs => {
  console.log(pkgs);
  // [{directory: packages/packageOne, pkg: PACKAGEDATA}, {directory: packages/packageTwo, pkg: PACKAGEDATA}]
});
```

## API

### readPkgs(patterns, options?)

Returns a `Promise` resolving to an array of loaded `package.json` with their given directory.

#### patterns

* Type: `string` `Array<string>`

A glob pattern or array of glob patterns matching directories that contain a `package.json`.

#### options

##### cwd

* Type: `string`
* Default: `process.cwd()`

The current working directory in which to search.

##### normalize

* Type: `boolean`
* Default: `true`

Whether or not to normalize the package data.

## License

MIT © Matthew Fernando Garcia
