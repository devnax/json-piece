const isObject = (obj: any) => typeof obj === "object" && !Array.isArray(obj);
const isArray = (arr: any) => typeof arr === "object" && Array.isArray(arr);
const isString = (str: any) => typeof str === "string";


export const isStringfy = (str: string): boolean => {
  const firstChar = str.charAt(0);
  const lastChar = str.charAt(str.length - 1);
  if ((firstChar === "{" || firstChar === "[") && firstChar === lastChar) {
    return true;
  }
  return false;
};
export const isStringObject = (str: string): boolean => {
  const firstChar = str.charAt(0);
  const lastChar = str.charAt(str.length - 1);
  if (firstChar === "{" && lastChar === "}") {
    return true;
  }
  return false;
};

export const isStringArray = (str: string): boolean => {
  const firstChar = str.charAt(0);
  const lastChar = str.charAt(str.length - 1);
  if (firstChar === "[" && lastChar === "]") {
    return true;
  }
  return false;
};

export const arrayToString = (arr: any[]): string => {
  if (isArray(arr)) {
    let formate = "";
    let coma = "";
    for (let val of arr) {
      if (isObject(val)) {
        formate += `${coma}${objectToString(val)}`;
      } else if (isArray(val)) {
        formate += `${coma}"${arrayToString(val)}"`;
      } else if (isString(val)) {
        val = val.replace(/"/gi, '\\"').trim();
        formate += `${coma}"${val}"`;
      } else {
        formate += `${coma}${val.toString()}`;
      }
      coma = ",";
    }
    return `[${formate.replace(/\s+/gi, " ")}]`;
  }
  return "";
};

export const objectToString = (obj: { [key: string]: any }): string => {
  if (isObject(obj)) {
    let formate = "";
    let coma = "";
    for (let key in obj) {
      let val = obj[key];
      if (isArray(val)) {
        formate += `${coma}"${key}":${arrayToString(val)}`;
      } else if (isObject(val)) {
        formate += `${coma}"${key}":${objectToString(val)}`;
      } else if (isString(val)) {
        val = val.replace(/"/gi, '\\"').trim();
        formate += `${coma}"${key}":"${val}"`;
      } else {
        formate += `${coma}"${key}":${val.toString()}`;
      }
      coma = ",";
    }
    return `{${formate.replace(/\s+/gi, " ")}}`;
  }

  return "";
};

export const toString = (data: any, encode = true): string => {
  let res = data;
  if (isArray(data)) {
    res = arrayToString(data);
  } else if (isObject(data)) {
    res = objectToString(data);
  }
  if (encode) {
    res = encodeURI(res);
  }
  return res;
};

export const parse = (str: string, decode = true) => {
  str = decode ? decodeURI(str) : str;
  // eslint-disable-next-line
  return new Function(`return ${str}`)(10);
};

export const isEqual = (a: any, b: any) => {
  return toString(a) === toString(b);
};
