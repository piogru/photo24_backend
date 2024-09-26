export function parseBoolean(param: string | undefined) {
  return param === "true" ? true : param === "false" ? false : undefined;
}
