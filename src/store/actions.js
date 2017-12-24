import * as types from './mutation-types';
import { axios } from '../utils/vue-axios';

export const login = ({
  commit,
}, {
  mobile,
  password,
}) => new Promise((resolve, reject) => {
  axios.post('login', {
    mobile,
    password,
  })
  .then((res) => {
    const result = res.data;
    commit(types.SET_USER, result);
    resolve(result);
  })
  .catch((err) => {
    commit(types.CLEAR_LOGIN_INFO);
    reject(err);
  });
});

export const loginWithToken = ({
  state,
  commit,
}) => new Promise((resolve, reject) => {
  if (state.token) {
    axios.get('loginWithToken', {})
      .then((res) => {
        const result = res.data;
        commit(types.SET_USER, result);
        resolve(result);
      })
      .catch((err) => {
        commit(types.CLEAR_LOGIN_INFO);
        reject(err);
      });
  } else {
    reject();
  }
});

export const setToken = ({
  commit,
}, token) => {
  commit(types.SET_TOKEN, token);
};

export const setLang = ({
  commit,
}, lang) => {
  commit(types.SET_LANG, lang);
};

export const logout = ({
  commit,
}) => {
  commit(types.CLEAR_LOGIN_INFO);
};
