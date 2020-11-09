# `@elunic/logger-nestjs`

[![Build Status](https://travis-ci.org/elunic/node-logger-nestjs.svg?branch=master)](https://travis-ci.org/elunic/node-logger-nestjs)

Written in TypeScript!

A companion module for `@elunic/logger` providing a `LoggerModule` and decorators aiming at a simple
& straightforward use with NestJS.

## Table of Contents

- [`@elunic/logger-nestjs`](#eluniclogger-nestjs)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Functionality](#functionality)
      - [The `@InjectLogger()` Decorator](#the-injectlogger-decorator)
      - [`getLoggerTokenFor(childNamespace: string)`](#getloggertokenforchildnamespace-string)
  - [Mock usage](#mock-usage)
    - [Examples](#examples)
  - [License](#license)

## Installation

```bash
$ npm install @elunic/logger-nestjs
```

## Functionality

Example:

```typescript
import { Module, Injectable, Inject } from '@nestjs/common';
import { createLogger, LogService } from '@elunic/logger';
import { LoggerModule, LOGGER } from '@elunic/logger-nestjs';

const logger = createLogger('app');

@Module({
  imports: [LoggerModule.forRoot(logger)],
  providers: [HelperService],
})
export class AppModule {}

@Injectable()
class HelperService {
  constructor(@Inject(LOGGER) private log: LogService) {}

  logFoo() {
    this.log.info('foo');
  }

  logChild() {
    this.log.createLogger('childLogger').info('child foo');
  }
}
```

#### The `@InjectLogger()` Decorator

As a preferred alternative, a child logger can be injected directly, without
having to inject the root log service to create a logger in a second
step.

The `@InjectLogger()` decorator takes a **namespace string as argument**.

If no argument is passed, the root LogService is returned.

```typescript
import { Module, Injectable, Inject } from '@nestjs/common';
import { createLogger, LogService } from '@elunic/logger';
import { LoggerModule, InjectLogger } from '@elunic/logger-nestjs';

const logger = createLogger('app');

@Module({
  imports: [LoggerModule.forRoot(logger)],
  providers: [HelperService],
})
export class AppModule {}

@Injectable()
class HelperService {
  constructor(
    @InjectLogger('helper') private log: LogService,
    @InjectLogger() private rootLog: LogService,
  ) {}

  logFoo() {
    // This will output "INFO [app:helper] foo"
    this.log.info('foo');
  }

  logRootFoo() {
    // This will output "INFO [app] foo"
    this.rootLog.info('foo');
  }

  logChild() {
    // This will NOT work here, our logger is already a child logger.
    // this.log.createLogger('childLogger').info('child foo');
  }
}
```

#### `getLoggerTokenFor(childNamespace: string)`

Returns the token used internally for injection by the module. This can be useful
for defining a custom provider to override the returned value.

A typical use case for this is returning a mock logger in tests.

## Mock usage

A `MockNestjsLoggerModule` is provided for use in tests.

### Examples

Imagine that `CatsService` depends on our `LogService`:

```typescript
import { MockLogService } from '@elunic/logger/mocks';
import { MockNestjsLoggerModule } from '@elunic/logger-nestjs/mocks';
import { CatsService } from './cats.service';

describe('NestJS module', () => {
  let catsService: CatsService;
  let logService: MockLogService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MockNestjsLoggerModule],
      providers: [CatsService],
    }).compile();

    catsService = module.get<CatsService>(CatsService);
  });

  it('should call logs', async () => {
    // ... do some actual testing here

    // logService.error is a sinon spy
    expect(logService.error.callCount).toEqual(1);

    // We can to know about some child logger
    const childLoggerSpy = logService.getLogger('apptest:component');
    expect(childLoggerSpy.error.callCount).toEqual(1);
  });
});
```

## License

MIT License

Copyright (c) 2020 elunic AG/William Hefter <wh@elunic.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
