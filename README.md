# argv-to-list

Print each command-line argument as a line

## Requirements

* Node.js ≥ 6.0.0, and npm

## Installation

```bash
npm install --global argv-to-list
```

## Usage

### Basic

```bash
argv-to-list first second 'This argument contains spaces'
```

**Output:** The following text would be printed to terminal screen

```text
first
second
This argument contains spaces
```

### Advanced

#### Chunks of data

Each argument is pushed to stdout seperately, that means there are each chunk of stdout for every one of them.

**Example:**

```javascript
const arguments = ['abc\ndef\nghi\njkl', 'foo\nbar']
const {stdout} = require('child_process').spawn('argv-to-list', arguments)
const print = chunk => console.log({chunk: String(chunk)})
stdout.on('data', print)
```

This is the output:

```text
{ chunk: 'abc\ndef\nghi\njkl\n' }
{ chunk: 'foo\nbar\n' }
```

#### As a module

**Syntax:**

```typescript
argvToList(input = process.argv, begin = 2, end?: int): void
```
