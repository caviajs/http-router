export function convertToNumber(data: any): number | any {
  if (data === '') {
    return data;
  }

  const casted = Number(data);

  return isNaN(casted) ? data : casted;
}
