# gyst [![Build Status](https://travis-ci.org/cottonflop/gyst.svg?branch=master)](https://travis-ci.org/cottonflop/gyst)

> A flexible automated testing framework


## Install

```
$ npm install gyst
```


## Usage

```js
const gyst = require('gyst');

gyst('unicorns');
//=> 'unicorns & rainbows'
```


## API

### gyst(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global gyst
```

```
$ gyst --help

  Usage
    gyst [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ gyst
    unicorns & rainbows
    $ gyst ponies
    ponies & rainbows
```


## License

MIT © [Betsy Fox](https://github.com/cottonflop/gyst)
