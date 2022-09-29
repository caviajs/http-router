<div align="center">
<h3>@caviajs/http-contract</h3>
<p>ecosystem for your guinea pig</p>
</div>

## Introduction

Contract, based on the scheme, converts and validates the request and response payload. 
It also has the ability to generate an HTTP client.

## Usage

### Installation

```shell
npm install @caviajs/http-contract --save
```

### Configure the interceptor

```typescript
import { HttpContract } from '@caviajs/http-contract';
import { Interceptor } from '@caviajs/http-router';

export const HttpContractInterceptor: Interceptor = HttpContract.setup();
```

### Bind the interceptor

```typescript
httpRouter
  .intercept(HttpContractInterceptor);
```

### Setup contract route

The contract route is needed to provide the specification on the basis of which the contract will be generated.

```typescript
httpRouter
  .route({
    handler: () => httpRouter.specification,
    method: 'GET',
    path: '/meta/contract',
  });
```

### Setup contract metadata in routes

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      // request.body
      // request.headers
      // request.params
      // request.query

      // ...
    },
    metadata: {
      contract: {
        // ...
      },
    },
    method: 'POST',
    path: '/guinea-pigs',
  });
```

##### metadata.contract.description

```typescript
httpRouter
  .route({
    // ...
    metadata: {
      contract: {
        /* 
          description: string;
        */
      },
    },
  });
```

##### metadata.contract.name

The name is the **unique** name of the router from which the CLI generates the HTTP client.

```typescript
httpRouter
  .route({
    // ...
    metadata: {
      contract: {
        /* 
          name: string;
        */
      },
    },
  });
```

##### metadata.contract.request.body

Using this schema you can try to convert and validate the request body for specific mime-types.

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      // request.body ...
    },
    metadata: {
      contract: {
        request: {
          /*
            body: {
              'application/json'?: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaNumber | SchemaObject | SchemaStream;
              'application/octet-stream'?: SchemaBuffer | SchemaStream;
              'application/pdf'?: SchemaBuffer | SchemaStream;
              'application/x-www-form-urlencoded'?: SchemaBuffer | SchemaStream | SchemaObject;
              'application/xml'?: SchemaBuffer | SchemaStream | SchemaString;
              'image/gif'?: SchemaBuffer | SchemaStream;
              'image/jpeg'?: SchemaBuffer | SchemaStream;
              'image/png'?: SchemaBuffer | SchemaStream;
              'image/tiff'?: SchemaBuffer | SchemaStream;
              'multipart/form-data'?: SchemaBuffer | SchemaStream;
              'text/css'?: SchemaBuffer | SchemaStream | SchemaString;
              'text/csv'?: SchemaBuffer | SchemaStream | SchemaString;
              'text/html'?: SchemaBuffer | SchemaStream | SchemaString;
              'text/plain'?: SchemaBuffer | SchemaStream | SchemaString;
              'video/mp4'?: SchemaBuffer | SchemaStream;
            }
          */
        },
      },
    },
    /* ... */
  });
```

##### metadata.contract.request.headers

Using this schema you can validate the request headers.

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      // request.headers ...
    },
    metadata: {
      contract: {
        request: {
          /* 
            headers: {
              [name: string]: SchemaEnum | SchemaString;
            }
          */
        },
      },
    },
    /* ... */
  });
```

##### metadata.contract.request.params

Using this schema you can try to convert and validate the request params.

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      // request.params ...
    },
    metadata: {
      contract: {
        request: {
          /* 
            params: {
              [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
            }  
          */
        },
      },
    },
    /* ... */
  });
```

##### metadata.contract.request.query

Using this schema you can try to convert and validate the request query.

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      // request.query ...
    },
    metadata: {
      contract: {
        request: {
          /* 
            query: {
              [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
            }
          */
        },
      },
    },
    /* ... */
  });
```

##### metadata.contract.responses[status].body

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      response.statusCode = 200;

      // return ...
    },
    metadata: {
      contract: {
        responses: {
          200: {
            /* 
              body: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaStream | SchemaString; 
            */
          },
        },
      },
    },
    /* ... */
  });
```

##### metadata.contract.responses[status].headers

```typescript
httpRouter
  .route({
    handler: (request, response) => {
      response.statusCode = 200;
      response.setHeader('name', 'value');

      // ...
    },
    metadata: {
      contract: {
        responses: {
          200: {
            /*
              headers: {
                [name: string]: SchemaEnum | SchemaString;
              }
            */
          },
        },
      },
    },
    /* ... */
  });
```

### Generate a contract based on specification

```shell
generate-contract --url http://localhost:3000/meta/contract --output src/contracts/foo
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
