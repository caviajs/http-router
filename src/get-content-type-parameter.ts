// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
export function getContentTypeParameter(header: string, parameter: string): string | undefined {
  return header?.split(';').find(it => it.includes(parameter))?.split('=')[1]?.trim();
}
