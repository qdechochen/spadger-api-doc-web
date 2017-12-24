import Vue from 'vue';
import Vuex from 'vuex';
import * as Cookies from 'tiny-cookie';
import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
  get token() {
    return Cookies.get('___spadger');
  },
  user: null,
  lang: localStorage.getItem('lang') || 'en-US',
  configs: {},
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {},
  strict: debug,
});
