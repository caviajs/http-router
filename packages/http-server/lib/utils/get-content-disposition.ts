// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
export function getContentDisposition(header: string): string | undefined {
  const media = header?.split(';')[0];

  if (media === '') {
    return;
  }

  return media?.trim();
}
