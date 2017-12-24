import urlRegex from './url-regex';

export const APP = {
  name: 'Spadger Api Doc',
  version: '0.2',
  email: 'qdechochen@126.com',
};

export const EMAIL_REGEX = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
export const FILE_UPLOAD_COUNT = [1, 5];
export const FULLNAME_LENGTH = [2, 30];
export const MOBILE_REGEX = /^[1-9]\d{5,17}/;
export const PASSWORD_LENGTH = [4, 20];
export const SPACES_REGEX = /[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/;
export const TEXT_L_LENGTH = [10, 1000];
export const TEXT_XL_LENGTH = [10, 1000];
export const TEXT_N_LENGTH = [5, 50];
export const URL_REGEX = urlRegex;
export const VERIFY_CODE_LENGTH = 4;

