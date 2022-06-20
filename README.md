<div align="center">
<h3>@caviajs/http-router</h3>
<p>ecosystem for your guinea pig</p>
</div>

<div align="center">
<h4>Installation</h4>
</div>

```shell
npm install @caviajs/http-exception @caviajs/http-router rxjs --save
```

<div align="center">
<h4>Routing</h4>
</div>

```typescript
import { HttpRouter } from '@caviajs/http-router';

const httpRouter = new HttpRouter();

// ...

httpRouter
  .route({
    handler: (request, response) => {
      return [{ name: 'Cavia' }];
    },
    interceptors: [/* ... */],
    metadata: { /* ... */ },
    method: 'GET',
    path: '/guinea-pigs',
  })
  .route({
    handler: (request, response) => {
      // request.params.id;

      return { name: 'Cavia' };
    },
    interceptors: [/* ... */],
    metadata: { /* ... */ },
    method: 'GET',
    path: '/guinea-pigs/:id',
  });

// ...
```

<div align="center">
<h4>Response body serializing</h4>
</div>

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

<div align="center">
<h4>Handling errors</h4>
</div>

You can throw an `HttpException` in route `handler` and it will be caught by the built-in exception catching mechanism.

Any other exception than `HttpException` will be considered as unknown and will be throw an `HttpException` to the
client with the status `500`.

```typescript
import { HttpException } from '@caviajs/http-exception';

httpRouter.route({
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

<div align="center">
<h4>Interceptors</h4>
</div>

```typescript
import { tap, catchError, throwError } from 'rxjs';
import { HttpRouter } from '@caviajs/http-router';

const httpRouter = new HttpRouter();

httpRouter.intercept((request, response, next) => {
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

// ...
```

<div align="center">
<h4>Handle request</h4>
</div>

```typescript
import * as http from 'http';

// ...

const httpServer: http.Server = http.createServer((req, res) => {
  httpRouter.handle(req, res);
});

httpServer.listen(3000);
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
