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
      NPM_TAG = TAG
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

  return [
      ['dependencies', 'save-prod'],
      ['bundleDependencies', 'save-bundle'],
      ['optionalDependencies', 'save-optional'],
      ['devDependencies', 'save-dev']
  ]
      .map(([name, save]) => [info[name], save, name])
      .filter(pair => pair[0])
      .map(([object, save, name]) => [Object.getOwnPropertyNames(object), save, name])
      .map(NPM_TAG
        ? ([packages, ...rest]) => [packages.map(pkgname => pkgname + '@' + NPM_TAG), ...rest]
        : x => x
      )
      .filter(([{length}]) => length)
      .map(([packages, save, name]) => [
        `npm install --${save} ${packages.join(' ')}`,
        name,
        packages.length
      ])
      .map(([command, name, count]) => [
        `echo '[INFO] ${count} ${name}'`,
        'echo [COMMAND] ' + command,
        `cd '${wdir}' && ${command}`,
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
