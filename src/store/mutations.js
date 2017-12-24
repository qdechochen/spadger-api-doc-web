// import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.SET_USER](state, user) {
    state.user = user;
  },
  [types.SET_TOKEN](state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  [types.SET_LANG](state, lang) {
    state.lang = lang;
    localStorage.setItem('lang', lang);
  },
  [types.CLEAR_LOGIN_INFO](state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
  },
  [types.INIT_CONFIGS](state, configs) {
    state.configs = configs;
  },
};
