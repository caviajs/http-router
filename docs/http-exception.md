<div align="center">
<h3>@caviajs/http-exception</h3>
<p>ecosystem for your guinea pig</p>
</div>

## Introduction

This package includes an `HttpException` which is used to standardize error responses.

## Usage

### Installation

```shell
npm install @caviajs/http-exception --save
```

### Create an instance

#### Default reason:

```typescript
import { HttpException } from '@caviajs/http-exception';

const example = new HttpException(404);
example.getResponse(); // { statusCode: 404, statusMessage: 'Not Found' }
example.getStatus(); // 404
```

#### Custom string reason:

```typescript
import { HttpException } from '@caviajs/http-exception';

const example = new HttpException(404, 'Guinea pig not found');
example.getResponse(); // { statusCode: 404, statusMessage: 'Guinea pig not found' }
example.getStatus(); // 404
```

#### Custom object reason:

```typescript
import { HttpException } from '@caviajs/http-exception';

const example = new HttpException(404, { code: 'GUINEA_PIG_NOT_FOUND' });
example.getResponse(); // { code: 'GUINEA_PIG_NOT_FOUND' }
example.getStatus(); // 404
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
