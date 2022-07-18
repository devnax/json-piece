
# JSON PIECE

> Smallest array and json serializer

[![NPM](https://img.shields.io/npm/v/validex.svg)](https://www.npmjs.com/package/json-piece) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save json-piece
```

## Usage

```js

  import * as piece from 'json-piece'

  const stringfy  = piece.toString(array | object)
  const parse     = piece.parse(stringfy)
  const equal     = piece.isEqual(stringfy, parse)// true
  const isStringfy  = piece.isStringfy(stringfy) // true
```