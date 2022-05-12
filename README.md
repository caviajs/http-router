<div align="center">
<h3>@caviajs/http-server</h3>
<p>a micro framework for node.js</p>
</div>

<div align="center">
<h4>Installation</h4>
</div>

```shell
npm install @caviajs/http-server rxjs --save
```

<div align="center">
<h4>Routes</h4>
</div>

```typescript
import { Router } from '@caviajs/http-server';

const router = new Router();

router.route({
  handler: (request, response) => {
    return 'Hello Cavia';
  },
  interceptors: [/* ... */],
  method: 'GET',
  name: 'helloCavia',
  path: '/hello',
  schema: {/* ... */},
});
```

<div align="center">
<h4>Response body serializing</h4>
</div>

* **buffer** - dumped into the response stream;
  * Content-Type: application/octet-stream
  * Content-Length: [calc buffer length]
* **stream** - dumped into the response stream,
  * Content-Type: application/octet-stream
* **string** - dumped into the response stream,
  * Content-Type: text/plain
  * Content-Length: [calc string byte length]
* **true, false, number, null, array, object** - parsed by JSON.stringify and dumped into the response stream,
  * Content-Type: application/json; charset=utf-8
  * Content-Length: [calc string byte length]

<div align="center">
<h4>Handling errors</h4>
</div>

You can throw an `HttpException` in route `handler` and it will be caught by the built-in exception catching mechanism.

Any other exception than `HttpException` will be considered as unknown and will be throw an `HttpException` to the
client with the status `500`.

```typescript
import { HttpException } from '@caviajs/http-server';

// ...
throw new HttpException(404, 'Guinea pig not found');
// ...
```

If you want to react to any exceptions returned, you can use the stream in the interceptors.

<div align="center">
<h4>Interceptors</h4>
</div>

```typescript
import { tap, catchError, throwError } from 'rxjs';
import { Router } from '@caviajs/http-server';

const router = new Router();

router.intercept((request, response, next) => {
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
  <sub>Built with ❤︎ by <a href="https://twitter.com/partyka95">Paweł Partyka</a></sub>
</div>
