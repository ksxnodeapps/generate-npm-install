'use strict'
const path = require('path')
const {spawnSync} = require('child_process')
const {env} = require('process')
const {dump} = require('js-yaml')
const {ProductIterable} = require('x-iterable')
const subject = require.resolve('../index.js')
const cwd = path.resolve(__dirname, 'virtual-env')

const fmtStdIO = buf =>
  buf && buf.length ? String(buf) : '((Empty))'

const spawnSyncSnap = (...args) => {
  const {status, signal, error, stdout, stderr} = spawnSync(...args)

  return {
    status,
    signal,
    error: error || null,
    stdout: fmtStdIO(stdout),
    stderr: fmtStdIO(stderr)
  }
}

const createSnap = pattern => '\n' + dump(
  new ProductIterable(...pattern)
    .map(([program, tag]) => [{env, ...program, ...tag}, program, tag])
    .map(([env, ...rest]) => [spawnSyncSnap(subject, {env, cwd}), ...rest])
    .map(([result, program, tag]) => ({case: {program, tag}, result}))
    .to(Array),
  {
    noRefs: true
  }
) + '\n'

test('Snapshot', () => {
  expect(
    createSnap([
      [{}, {USE_YARN: 'true'}, {USE_PNPM: 'true'}],
      [{}, {TAG: 'latest'}, {NPM_TAG: 'latest'}]
    ])
  ).toMatchSnapshot()
})
