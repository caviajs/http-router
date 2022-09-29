const DEFAULT_STRICT: boolean = false;

export function getSchemaStrict(schema: any): boolean {
  return schema?.hasOwnProperty('strict') ? schema.strict : DEFAULT_STRICT;
}
