#! /usr/bin/env node
'use strict'

const {stdout, stderr, env, exit} = require('process')
const {spawn} = require('child_process')

const child = spawn('node', [require.resolve('./index.js')], {
  env: {
    ...env,
    USE_YARN: 'true'
  },
  stdio: 'inherit'
})

child.on('exit', x => exit(x))
