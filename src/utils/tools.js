
import _ from 'lodash';
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
  SPACES_REGEX,
  URL_REGEX,
} from '@/configs/consts';

export const isEmail = str => EMAIL_REGEX.test(str);

export const isFQDN = (str) => {
  if (SPACES_REGEX.test(str)) {
    return false;
  }
  if (str[0] === '.' || str[str.length - 1] === '.') return false;

  const parts = str.split('.');
  if (parts.length < 2) return false;
  for (let part, i = 0; i < parts.length; i++) {
    part = parts[i];
    if (part.length === 0) return false;

    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }

    // full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }

    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }

  return true;
};

export const isMobile = str => MOBILE_REGEX.test(str);

export const isOcc = (code) => {
  const ws = [3, 7, 9, 10, 5, 8, 4, 2];
  const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const reg = /^([0-9A-Z]){8}-[0-9|X]$/;
  let pass = false;
  if (reg.test(code)) {
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += str.indexOf(code.charAt(i)) * ws[i];
    }
    let check = 11 - (sum % 11);
    if (check === 11) {
      check = '0';
    } else if (check === 10) {
      check = 'X';
    } else {
      check = `${check}`;
    }

    if (check === code.charAt(9)) {
      pass = true;
    }
  }

  return pass;
};

export const isUrl = str => URL_REGEX.test(str);

export const updateAssign = (dest, ...sources) => {
  const source = Object.assign({}, ...sources);
  const sourceKeys = Object.keys(source);
  Object.keys(dest).forEach((key) => {
    if (sourceKeys.includes(key)) {
      dest[key] = source[key];
    }
  });
  return dest;
};
export const deepUpdateAssign = (dest, ...sources) => {
  const source = Object.assign({}, ...sources);
  const sourceKeys = Object.keys(source);
  Object.keys(dest).forEach((key) => {
    if (sourceKeys.includes(key)) {
      if (source[key] instanceof Array) {
        dest[key] = JSON.parse(JSON.stringify(source[key]));
      } else if (typeof source[key] === 'object') {
        dest[key] = _.defaultsDeep({}, source[key]);
      } else {
        dest[key] = source[key];
      }
    }
  });
  return dest;
};

export const deepAssign = (dest, source) => _.defaultsDeep(dest, source);

export const resetObject = (o) => {
  const _reset = (obj) => {
    Object.keys(obj).forEach((p) => {
      if (obj[p]) {
        if (typeof obj[p] === 'object') {
          _reset(obj[p]);
        } else {
          obj[p] = null;
        }
      }
    });
  };

  _reset(o);
};
