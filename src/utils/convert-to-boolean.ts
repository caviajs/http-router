export function convertToBoolean(data: any): boolean | any {
  switch (data) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return data;
  }
}
