# TsLinq

Linq for typescript

---

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/a724fe0f1ab1456ba159aa5e97834bf7)](https://www.codacy.com/gh/n3okill/tslinq/dashboard?utm_source=github.com&utm_medium=referral&utm_content=n3okill/tslinq&utm_campaign=Badge_Grade) ![Test Status](https://github.com/n3okill/tslinq/actions/workflows/test.yml/badge.svg)

---

## Description

Linq for typescript using the fastest iteration mode and deferred methods,

## Usage

Install the package

```js
npm install --save @n3okill/tslinq
```

```js
import { Enumerable, EnumerableAsync } from "@n3okill/tslinq";

const sum = Enumerable.asEnumerable([43, 1, 583, 6]).sum();
console.log(`Sum: ${sum} === 633`);
```

or

```js
const tslinq = require("@n3okill/tslinq");
const sum = await tslinq.EnumerableAsync.asEnumerable([43, 1, 583, 6]).sum();
console.log(`Sum: ${sum} === 633`);
```

## Runing tests

- `npm run lint`: runs the linter
- `npm run unit`: run unit tests
- `npm test`: run both lint and unit tests

## Contribute

If you find a problem with the package you can

- [Submit a Bug](https://github.com/n3okill/tslinq/issues)
  - If you provide a test case it will make the issue resolution faster

or even make a

- [Pull request](https://github.com/n3okill/tslinq/pulls)

### Add something new

If you wan't to add something new, following this steps would be much apreciated:

- Develop the new helper, with clean and readable code
- Develop tests for the new helper
- Include in the comments a description of what the helper does, the input arguments and what it returns

## Documentation

### Namespaces

- [Interfaces](docs/interfaces.md)
- [Types](docs/types.md)

### Classes

- [Enumerable](docs/classes/enumerable.md)
- [EnumerableAsync](docs/classes/enumerableasync.md)

## Examples

For more examples just check the tests folder

## Why this module

To bring the best features of linq and it's easy usability to typescript with a fast implementation

## Credits

- [Microsoft](http://www.microsoft.com) - For developing linq and typescript

## License

MIT License

Copyright (c) 2021 Joao Parreira [joaofrparreira@gmail.com](mailto:joaofrparreira@gmail.com)
