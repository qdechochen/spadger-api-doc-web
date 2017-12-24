import {
  isEmail,
  isFQDN,
  isMobile,
  isOcc,
  isUrl,
} from './tools';

let _i18n;
export const setupI18n = (i18n) => {
  _i18n = i18n;
};

export const emailValidator = (rule, value, callback) => {
  if (!isEmail(value)) {
    callback(new Error(_i18n.t('err_incorrect_email_format')));
  } else {
    callback();
  }
};

export const fqdnValidator = (rule, value, callback) => {
  if (isFQDN(value)) {
    callback();
  } else {
    callback(new Error(_i18n.t('err_incorrect_fqdn_format')));
  }
};

export const lengthValidator = (rule, value, callback) => {
  if (!value) {
    callback();
  } else {
    const { length = -1, min = -1, max = -1 } = rule;
    if (value instanceof Array) {
      if (length >= 0 && value.length !== length) {
        callback(new Error(_i18n.t('err_size_should_be', [length])));
      } else if (min !== -1 && max !== -1 && (value.length < min || value.length > max)) {
        callback(new Error(_i18n.t('err_size_should_be_between', [min, max])));
      } else if (min !== -1 && max === -1 && value.length < min) {
        callback(new Error(_i18n.t('err_size_should_be_gt', [min])));
      } else if (max !== -1 && min === -1 && value.length > max) {
        callback(new Error(_i18n.t('err_size_should_be_lt', [max])));
      } else {
        callback();
      }
    } else if (typeof value === 'string') {
      if (length >= 0 && value.length !== length) {
        callback(new Error(_i18n.t('err_length_should_be', [length])));
      } else if (min !== -1 && max !== -1 && (value.length < min || value.length > max)) {
        callback(new Error(_i18n.t('err_length_should_be_between', [min, max])));
      } else if (min !== -1 && max === -1 && value.length < min) {
        callback(new Error(_i18n.t('err_length_should_be_gt', [min])));
      } else if (max !== -1 && min === -1 && value.length > max) {
        callback(new Error(_i18n.t('err_length_should_be_lt', [max])));
      } else {
        callback();
      }
    } else {
      callback(new Error(_i18n.t('wrong_validate_rule')));
    }
  }
};

export const mobileValidator = (rule, value, callback) => {
  if (!isMobile(value)) {
    callback(new Error(_i18n.t('err_incorrect_mobile_format')));
  } else {
    callback();
  }
};

export const numberValidator = (rule, value, callback) => {
  const { min, max } = rule;
  if (typeof value === 'number') {
    if (typeof min === 'number' && typeof max === 'number' && (value < min || value > max)) {
      callback(new Error(_i18n.t('err_should_be_between', [min, max])));
    } else if (typeof min === 'number' && typeof max !== 'number' && value < min) {
      callback(new Error(_i18n.t('err_should_be_gt', [min])));
    } else if (typeof max === 'number' && typeof min !== 'number' && value > max) {
      callback(new Error(_i18n.t('err_should_be_lt', [max])));
    } else {
      callback();
    }
  } else {
    callback(new Error(_i18n.t('err_not_a_number')));
  }
};

export const occValidator = (rule, value, callback) => {
  if (isOcc(value)) callback();
  else callback(new Error(_i18n.t('err_incorrect_occ_format')));
};

export const requiredValidator = (rule, value, callback) => {
  const { err = 'pls_input', fieldName } = rule;
  let { field } = rule;
  if (fieldName) field = fieldName;

  let pass = true;
  if (value === null || value === undefined) {
    pass = false;
  } else if (value instanceof Array) {
    if (value.length === 0) pass = false;
  } else if (typeof value === 'object') {
    if (Object.keys(value).length === 0) pass = false;
  } else if (!value && value !== 0 && value !== false) pass = false;

  if (!pass) {
    callback(new Error(_i18n.t(err, [_i18n.t(field)])));
  } else {
    callback();
  }
};

export const urlValidator = (rule, value, callback) => {
  if (isUrl(value)) callback();
  else callback(new Error(_i18n.t('err_url_format')));
};
