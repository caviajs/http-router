const DEFAULT_NULLABLE: boolean = false;

export function getSchemaNullable(schema: any): boolean {
  return schema?.hasOwnProperty('nullable') ? schema.nullable : DEFAULT_NULLABLE;
}
