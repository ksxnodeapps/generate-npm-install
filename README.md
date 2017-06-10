# generate-npm-install

Generate npm install commands base on package.json

## Requirements

* Node.js ≥ 6.0.0, and npm
* UNIX-like shell, e.g. sh, bash, zsh

## Installation

```bash
npm install --global generate-npm-install
```

## Usage

### Command-line

This will generate `npm install --save-{prod,bundle,optional,dev}` commands base on `package.json` in working directory

```sh
generate-npm-install # output contains: npm install --save... package1 package2 ...
NPM_TAG=latest generate-npm-install # output contains: npm install --save... package1@latest package2@latest ...
```

This will generate `npm install` commands for `/path/to/directory/package.json`

```sh
generate-npm-install /path/to/directory
NPM_TAG=latest generate-npm-install /path/to/directory
```

This will execute generated `npm install` commands

```sh
generate-npm-install | sh
NPM_TAG=latest generate-npm-install | sh
generate-npm-install /path/to/directory | sh
NPM_TAG=latest generate-npm-install /path/to/directory | sh
```

### JavaScript APIs

#### Import module

```javascript
const generateNpmInstall = require('generate-npm-install')
```

#### Function Usage

```typescript
generateNpmInstall(options: {
  process: {
    env: {
      TAG?: string,
      NPM_TAG: string = TAG
    }
  } = require('process'),

  fs: {
    readFileSync: (filename: string) => {
      toString: (encoding: string = 'utf8') => string
    }
  } = require('fs'),

  path: {
    resolve: (...args: string[]) => string
  } = require('path'),

  directory: string = process.cwd()
}): string
```

* `options.process`: object, default to `process`
* `options.process.env`: object, default to `{}`
* `options.process.env.NPM_TAG`: string, default to `options.process.env.TAG`
* `options.process.env.TAG`: string, default to `undefined`
* `options.fs`: object, default to `fs`
* `options.fs.readFileSync`: function
* `options.path`: object, default to `path`
* `options.path.resolve`: function
* `options.directory`: string, path to a directory, default to `options.process.cwd()`
* Returns a string contains UNIX shell script
