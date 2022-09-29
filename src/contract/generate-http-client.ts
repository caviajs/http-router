import prettier from 'prettier';
import { camelCase } from '../utils/camel-case';
import { generateStructure } from './generate-structure';
import { getSchemaRequired } from './get-schema-required';
import { pascalCase } from '../utils/pascal-case';
import { isSchemaArray } from './schema-array';
import { isSchemaBoolean } from './schema-boolean';
import { isSchemaBuffer } from './schema-buffer';
import { isSchemaEnum } from './schema-enum';
import { isSchemaNumber } from './schema-number';
import { isSchemaObject } from './schema-object';
import { isSchemaStream } from './schema-stream';
import { isSchemaString } from './schema-string';
import { Specification, SpecificationRoute } from '../router/http-router';

function generateMethod(route: SpecificationRoute): string {
  let content: string = '';

  const contractName = route.metadata?.contract?.name;
  const contractRequestBody = route.metadata?.contract?.request?.body;
  const contractRequestHeaders = route.metadata?.contract?.request?.headers;
  const contractRequestParams = route.metadata?.contract?.request?.params;
  const contractRequestQuery = route.metadata?.contract?.request?.query;
  const contractResponses = route.metadata?.contract?.responses;

  if (contractName) {
    const contractNameAsCamelCase: string = camelCase(contractName);
    const contractNameAsPascalCase: string = pascalCase(contractName);

    const isBodyRequired: boolean = Object.values(contractRequestBody || {}).some((schema) => getSchemaRequired(schema));
    const isHeadersRequired: boolean = isBodyRequired || Object.values(contractRequestHeaders || {}).some((schema) => getSchemaRequired(schema));
    const isParamsRequired: boolean = Object.values(contractRequestParams || {}).some((schema) => getSchemaRequired(schema));
    const isQueryRequired: boolean = Object.values(contractRequestQuery || {}).some((schema) => getSchemaRequired(schema));

    const isPayloadRequired: boolean = isBodyRequired || isHeadersRequired || isParamsRequired || isQueryRequired;

    for (const mimeType of Object.keys(contractRequestBody || {})) {
      content += `public static async ${ contractNameAsCamelCase }(payload${ isPayloadRequired ? '' : '?' }: {`;
      content += `agent?: http.Agent | https.Agent,`;
      content += `body${ isBodyRequired ? '' : '?' }: ${ contractNameAsPascalCase }Body${ pascalCase(mimeType) },`;
      content += `headers${ isHeadersRequired ? '' : '?' }: { 'content-type': '${ mimeType }'; } & ${ contractNameAsPascalCase }Headers,`;
      content += contractRequestParams ? `params${ isParamsRequired ? '' : '?' }: ${ contractNameAsPascalCase }Params,` : '';
      content += contractRequestQuery ? `query${ isQueryRequired ? '' : '?' }: ${ contractNameAsPascalCase }Query,` : '';
      content += `timeout?: number,`;
      content += `}): Promise<${ contractNameAsPascalCase }Response>;`;
    }

    content += `public static async ${ contractNameAsCamelCase }(payload${ isPayloadRequired ? '' : '?' }: {`;
    content += `agent?: http.Agent | https.Agent,`;
    content += contractRequestBody ? `body${ isBodyRequired ? '' : '?' }: any,` : '';
    content += `headers${ isHeadersRequired ? '' : '?' }: ${ contractNameAsPascalCase }Headers,`;
    content += contractRequestParams ? `params${ isParamsRequired ? '' : '?' }: ${ contractNameAsPascalCase }Params,` : '';
    content += contractRequestQuery ? `query${ isQueryRequired ? '' : '?' }: ${ contractNameAsPascalCase }Query,` : '';
    content += `timeout?: number,`;
    content += `}): Promise<${ contractNameAsPascalCase }Response> {`;
    content += `const url: URL = new URL('${ route.path }', this.connectionUrl);`;

    if (contractRequestParams) {
      content += `Object.entries(payload?.params || {}).forEach(([key, value]) => {`;
      content += 'url.pathname = url.pathname.replace(`:${ key }`, value);';
      content += `});`;
    }

    if (contractRequestQuery) {
      content += 'Object.entries(payload?.query || {}).forEach(([key, value]) => {';
      content += 'url.searchParams.set(key, value);';
      content += '});';
    }

    content += 'const response: HttpResponse<Readable> = await HttpClient.request({';
    content += 'agent: payload?.agent,';
    content += contractRequestBody ? 'body: payload?.body,' : '';
    content += 'headers: payload?.headers,';
    content += `method: '${ route.method }',`;
    content += `responseType: 'stream',`;
    content += `timeout: payload?.timeout,`;
    content += `url: url.toString(),`;
    content += '});';

    content += `switch (response.statusCode) {`;

    for (const [status, response] of Object.entries(contractResponses || {})) {
      content += `case ${ status }:`;
      content += `return <${ pascalCase(contractName) }Response${ status }>{`;

      if (isSchemaArray(response.body)) {
        content += `body: await streamToJSON(response.body),`;
      } else if (isSchemaBoolean(response.body)) {
        content += `body: await streamToJSON(response.body),`;
      } else if (isSchemaBuffer(response.body)) {
        content += `body: await streamToBuffer(response.body),`;
      } else if (isSchemaEnum(response.body)) {
        content += `body: await streamToJSON(response.body),`;
      } else if (isSchemaNumber(response.body)) {
        content += `body: await streamToJSON(response.body),`;
      } else if (isSchemaObject(response.body)) {
        content += `body: await streamToJSON(response.body),`;
      } else if (isSchemaStream(response.body)) {
        content += `body: response.body,`;
      } else if (isSchemaString(response.body)) {
        content += `body: await streamToString(response.body),`;
      } else {
        content += `body: response.body,`;
      }

      content += `headers: response.headers,`;
      content += `statusCode: response.statusCode,`;
      content += `statusMessage: response.statusMessage,`;
      content += `};`;
    }

    content += 'default:';
    content += 'return <any>response';

    content += `}`;


    content += `}`;
  }

  return content;
}

function generateRequestBodyTypes(route: SpecificationRoute): string {
  let content: string = '';

  const contractName: string | undefined = route.metadata?.contract?.name;
  const contractRequestBody = route.metadata?.contract?.request?.body;

  if (contractName) {
    Object.entries(contractRequestBody || {}).forEach(([mimeType, mimeTypeSchema]) => {
      content += `export type ${ pascalCase(contractName) }Body${ pascalCase(mimeType) } = ${ generateStructure(mimeTypeSchema) };`;
    });
  }

  return content;
}

function generateRequestHeadersType(route: SpecificationRoute): string {
  let content: string = '';

  const contractName: string | undefined = route.metadata?.contract?.name;
  const contractRequestHeaders = route.metadata?.contract?.request?.headers;

  if (contractName) {
    const structure: string = generateStructure({ properties: contractRequestHeaders || {}, strict: false, type: 'object' });

    content += `export type ${ pascalCase(contractName) }Headers = ${ structure };`;
  }

  return content;
}

function generateRequestParamsType(route: SpecificationRoute): string {
  let content: string = '';

  const contractName: string | undefined = route.metadata?.contract?.name;
  const contractRequestParams = route.metadata?.contract?.request?.params;

  if (contractName && contractRequestParams) {
    const structure: string = generateStructure({ properties: contractRequestParams, strict: true, type: 'object' });

    content += `export type ${ pascalCase(contractName) }Params = ${ structure };`;
  }

  return content;
}

function generateRequestQueryType(route: SpecificationRoute): string {
  let content: string = '';

  const contractName: string | undefined = route.metadata?.contract?.name;
  const contractRequestQuery = route.metadata?.contract?.request?.query;

  if (contractName && contractRequestQuery) {
    const structure: string = generateStructure({ properties: contractRequestQuery || {}, strict: false, type: 'object' });

    content += `export type ${ pascalCase(contractName) }Query = ${ structure };`;
  }

  return content;
}

function generateResponseTypes(route: SpecificationRoute): string {
  let content: string = '';

  const contractName = route.metadata?.contract?.name;
  const contractResponses = route.metadata?.contract?.responses;

  if (contractName) {
    if (contractResponses) {
      content += `export type ${ pascalCase(contractName) }Response =`;
      for (const status of Object.keys(contractResponses)) {
        content += `| ${ pascalCase(contractName) }Response${ status }`;
      }
      content += `;`;

      for (const [status, response] of Object.entries(contractResponses)) {
        content += `export interface ${ pascalCase(contractName) }Response${ status } extends HttpResponse {`;
        content += `body: ${ pascalCase(contractName) }Response${ status }Body,`;
        content += `headers: ${ pascalCase(contractName) }Response${ status }Headers,`;
        content += `statusCode: ${ status },`;
        content += `statusMessage: string,`;
        content += `}`;

        if (response.body) {
          content += `export type ${ pascalCase(contractName) }Response${ status }Body = ${ generateStructure(response.body) };`;
        } else {
          content += `export type ${ pascalCase(contractName) }Response${ status }Body = unknown;`;
        }

        if (response.headers) {
          content += `export type ${ pascalCase(contractName) }Response${ status }Headers = ${ generateStructure({
            properties: response.headers,
            strict: false,
            type: 'object'
          }) };`;
        } else {
          content += `export type ${ pascalCase(contractName) }Response${ status }Headers = { [name: string]: string; };`;
        }
      }
    } else {
      content += `export type ${ pascalCase(contractName) }Response = HttpResponse<Readable>;`;
    }
  }

  return content;
}

export function generateHttpClient(name: string, specification: Specification): string {
  let content: string = '';

  content += `import { HttpClient, HttpResponse } from '@caviajs/http';`;
  content += `import { Readable } from 'stream';`;
  content += `import http from 'http';`;
  content += `import https from 'https';`;

  content += `function streamToBuffer(stream: Readable): Promise<Buffer> {`;
  content += `return new Promise((resolve, reject) => {`;
  content += `let buffer: Buffer = Buffer.alloc(0);`;
  content += `stream.on('data', (chunk: Buffer) => {buffer = Buffer.concat([buffer, chunk]);});`;
  content += `stream.on('end', () => resolve(buffer));`;
  content += `stream.on('error', (err) => reject(err));`;
  content += `});`;
  content += `}`;

  content += `async function streamToJSON(stream: Readable): Promise<boolean | number | null | object> {`;
  content += `return JSON.parse((await streamToBuffer(stream)).toString());`;
  content += `}`;

  content += `async function streamToString(stream: Readable): Promise<string> {`;
  content += `return (await streamToBuffer(stream)).toString();`;
  content += `}`;

  content += `export class ${ pascalCase(name) } {`;
  content += `public static connectionUrl: string = '';`;

  for (const route of specification.routes) {
    content += generateMethod(route);
  }

  content += `}`;

  for (const route of specification.routes) {
    content += generateRequestBodyTypes(route);
    content += generateRequestHeadersType(route);
    content += generateRequestParamsType(route);
    content += generateRequestQueryType(route);
    content += generateResponseTypes(route);
  }

  return prettier.format(content, {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    parser: 'typescript',
    arrowParens: 'avoid',
  });
}
