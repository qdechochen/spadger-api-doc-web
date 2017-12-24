import axios from 'axios';
import { Notification, Message } from 'element-ui';
import store from '../store';

axios.$i18n = {
  t: label => label,
};

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    if (config.url.startsWith(config.baseURL)) {
      config.headers.lang = store.state.lang;
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    const { data } = response;
    /*
    if (response.config.url.startsWith(response.config.baseURL) && response.headers.token) {
      store.dispatch('setToken', response.headers.token);
      localStorage.setItem('token', response.headers.token);
    }
    */
    if (data.message && data.message.length > 0) {
      Message({
        message: axios.$i18n.t(...data.message),
        type: 'success',
      });
    }

    return response;
  },
  ({ response }) => {
    if (!response) {
      response = {
        status: -1,
        data: {},
      };
    }

    const { status, data } = response;
    if (typeof data.message === 'string') {
      data.message = [data.message];
    } else if (data.message instanceof Array && data.message.length > 1) {
      const [template, ...fill] = data.message;
      data.message = [template, fill];
    }
    if (status === -1) {
      Notification.error({
        title: axios.$i18n.t('error'),
        message: axios.$i18n.t('no_internet'),
      });
    } else if (status > 500) {
      Notification.error({
        title: axios.$i18n.t('error'),
        message: axios.$i18n.t('server_error'),
      });
    } else if (status === 404) {
      Notification.error({
        title: axios.$i18n.t('operation_failed'),
        message: axios.$i18n.t('api_not_found'),
      });
    } else if (status === 401) {
      Notification.error({
        title: axios.$i18n.t('operation_failed'),
        message: axios.$i18n.t('err_unauthorized'),
      });
    } else if (status === 403) {
      Notification.error({
        title: axios.$i18n.t('operation_failed'),
        message: axios.$i18n.t('err_forbidden'),
      });
    } else if (status >= 400 && data.message.length > 0) {
      Notification.error({
        title: axios.$i18n.t('error'),
        message: axios.$i18n.t(...data.message),
      });
    }

    if (data.errs) {
      if (data.errs instanceof Array) {
        const errs = {};
        data.errs.forEach((err) => {
          errs[err] = ['err_wrong_data'];
        });
        data.errs = errs;
      } else if (typeof data.errs === 'object') {
        Object.keys(data.errs).forEach((key) => {
          if (typeof data.errs[key] === 'string') {
            data.errs[key] = [data.errs[key]];
          } else if (data.errs[key].length > 1) {
            const [label, ...replaces] = data.errs[key];
            data.errs[key] = [label, replaces];
          }
        });
      }
    }
    return Promise.reject(data);
  },
);

const vueAxios = {
  install(Vue, { i18n, baseUrl }) {
    axios.defaults.timeout = 5000;
    axios.$i18n = i18n;
    axios.defaults.baseURL = baseUrl;
    axios.defaults.withCredentials = true;
    Object.defineProperty(Vue.prototype, '$axios', { value: axios });
  },
};

export {
  vueAxios as default,
  axios,
};
