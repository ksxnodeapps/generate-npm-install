#! /usr/bin/env node
function main ({
  process = require('process'),
  fs: {readFileSync} = require('fs'),
  path: {resolve} = require('path'),
  directory
} = {}) {
  const {
    env: {
      TAG,
      NPM_TAG = TAG,
      USE_PNPM = 'false',
      USE_YARN = 'false'
    },
    argv,
    cwd
  } = process

  const wdir = directory || argv[2] || cwd()

  const info = JSON.parse(
    readFileSync(
      resolve(wdir, 'package.json')
    ).toString('utf8')
  )

  const {svmap, mkcmd} = String(USE_YARN) === 'true'
    ? {
      svmap: {
        dependencies: null,
        optionalDependencies: 'optional',
        devDependencies: 'dev'
      },
      mkcmd: (save, list) =>
        `yarn add ${save ? `--${save}` : ''} ${list}`
    }
    : {
      svmap: {
        dependencies: 'prod',
        bundleDependencies: 'bundle',
        optionalDependencies: 'optional',
        devDependencies: 'dev'
      },
      mkcmd: (() => {
        const npm = USE_PNPM === 'true' ? 'pnpm' : 'npm'
        const mkcmd = (save, list) =>
          `${npm} install --save-${save} ${list}`
        return mkcmd
      })()
    }

  return Object.entries(svmap)
    .map(([name, save]) => [info[name], save, name])
    .filter(pair => pair[0])
    .map(([object, save, name]) => [Object.getOwnPropertyNames(object), save, name])
    .map(NPM_TAG
      ? ([packages, ...rest]) => [
        packages.map(pkgname =>
          pkgname.includes('@') ? pkgname : pkgname + '@' + NPM_TAG
        ),
        ...rest
      ]
      : x => x
    )
    .filter(([{length}]) => length)
    .map(([packages, save, name]) => [
      mkcmd(save, packages.join(' ')),
      name,
      packages.length
    ])
    .map(([command, name, count]) => [
      `echo '[INFO] ${count} ${name}'`,
      'echo [COMMAND] ' + command,
      command,
      'echo "[STATUS] $?"',
      '\n'
    ])
    .map(cmdset => cmdset.join('\n'))
    .join('')
}

if (require.main === module) {
  require('process').stdout.write(main())
} else {
  module.exports = main
}
