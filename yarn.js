#! /usr/bin/env node
'use strict'

const {stdout, stderr, env, exit} = require('process')
const {spawn} = require('child_process')

const child = spawn('node', [require.resolve('./index.js')], {
  env: {
    ...env,
    USE_YARN: 'true'
  }
})

child.stdout.on('data', x => stdout.write(x))
child.stderr.on('data', x => stderr.write(x))
child.on('exit', x => exit(x))
