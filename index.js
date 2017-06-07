#! /usr/bin/env node
const {argv} = require('process')

const run = (input = argv, begin = 2, end) =>
  input.slice(begin, end).forEach(x => console.log(x))

if (require.main === module) {
  run()
} else {
  module.exports = run
}
