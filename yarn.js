#! /usr/bin/env node
const {exit, env} = require('process')
const {spawnSync} = require('child_process')

exit(
  spawnSync(
    'node',
    [require.resolve('./index.js')],
    {
      env: {...env, USE_YARN: 'true'},
      stdio: 'inherit'
    }
  ).status
)
