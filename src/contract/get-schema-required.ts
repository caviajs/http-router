const DEFAULT_REQUIRED: boolean = false;

export function getSchemaRequired(schema: any): boolean {
  return schema?.hasOwnProperty('required') ? schema.required : DEFAULT_REQUIRED;
}
