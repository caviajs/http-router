<div align="center">
<h3>@caviajs/http-router</h3>
<p>ecosystem for your guinea pig</p>
</div>

## Introduction

Routing, interceptors and exception handling.

## Usage

### Installation

```shell
npm install @caviajs/http-exception @caviajs/http-router rxjs --save
```

### Routing

```typescript
import { HttpRouter } from '@caviajs/http-router';

const httpRouter: HttpRouter = new HttpRouter();

httpRouter
  .route({
    handler: (request, response) => {
      return 'Hello Cavia';
    },
    interceptors: [/* ... */],
    metadata: { /* ... */ },
    method: 'GET',
    path: '/',
  });
```

#### Route parameters

To indicate the position of a parameter in the path, add a colon in front of the parameter name.

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      // request.params.id
    },
    interceptors: [/* ... */],
    metadata: { /* ... */ },
    method: 'GET',
    path: '/:id',
  });
```

#### Optional parameters

You can also create a route with optional parameters by using a question mark.

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      // request.params.id
    },
    interceptors: [/* ... */],
    metadata: { /* ... */ },
    method: 'GET',
    path: '/:id?', // <- optional parameter
  });
```

#### Duplicated routes

`HttpRouter` makes sure that the routes are unique, so if it detects a duplicate it will throw an error.

### Interceptors

Interceptors are a mechanism by which you can execute code before and after the handler is executed.

```typescript
import { tap, catchError, throwError } from 'rxjs';

/* ... */

httpRouter
  .intercept((request, response, next) => {
    // request...

    return next
      .handle()
      .pipe(
        tap(() => {
          // response...
        }),
        catchError((error) => {
          // catch error...

          return throwError(error);
        }),
      );
  });
```

### Response body serializing

* **buffer** - dumped into the response stream;
  * Content-Type: **[manually specified]** || **application/octet-stream**
  * Content-Length: **[calc buffer length]**
* **stream** - dumped into the response stream,
  * Content-Type: **[manually specified]** || **application/octet-stream**
* **string** - dumped into the response stream,
  * Content-Type: **[manually specified]** || **text/plain**
  * Content-Length: **[calc string byte length]**
* **true, false, number, null, array, object** - parsed by JSON.stringify and dumped into the response stream,
  * Content-Type: **[manually specified]** || **application/json; charset=utf-8**
  * Content-Length: **[calc string byte length]**

### Handling errors

You can throw an `HttpException` in route `handler` and it will be caught by the built-in exception catching mechanism.

Any other exception than `HttpException` will be considered as unknown and will be throw an `HttpException` to the
client with the status `500`.

```typescript
import { HttpException } from '@caviajs/http-exception';

httpRouter
  .route({
    handler: (request, response) => {
      // ...
      throw new HttpException(404, 'Guinea pig not found');
      // ...
    },
    interceptors: [/* ... */],
    metadata: { /* ... */ },
    method: 'GET',
    path: '/hello-cavia',
  });
```

If you want to react to any exceptions returned, you can use the stream in the interceptors.

### Bind the HttpRouter

```typescript
import * as http from 'http';

const httpRouter = new HttpRouter();
/* ... */

const httpServer: http.Server = http.createServer((req, res) => {
  httpRouter.handle(req, res);
});

httpServer.listen(3000);
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
