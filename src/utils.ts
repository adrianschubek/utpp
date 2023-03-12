export const replaceBetween = (str: string, start: number, end: number, what: string) => {
  return str.substring(0, start) + what + str.substring(end);
}

