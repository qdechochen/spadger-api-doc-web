import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui';
import * as Cookies from 'tiny-cookie';

import elementEnLocale from 'element-ui/lib/locale/lang/en';
import elementCnLocale from 'element-ui/lib/locale/lang/zh-CN';
import elementFormat from 'element-ui/lib/locale/format';
import '../theme/element-variables.scss';
import App from './App';
import store from './store';
import router from './router';
import routerHooks from './router/hooks';
import filters from './filters';
import vueAxios, { axios } from './utils/vue-axios';
import { setupI18n } from './utils/validators';
import * as storeMutationTypes from './store/mutation-types';
// import helper from './utils/helper';

Vue.config.productionTip = false;

Vue.use(Vuex);
// Vue.use(helper);
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue();

function setupView(i18n) {
  /* eslint-disable no-new */
  new Vue({
    i18n,
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App },
  });
  /* eslint-enable no-new */
}

Promise.all([axios.get(`${process.env.API_SERVER}system/language`), axios.get(`${process.env.API_SERVER}system/clientConfigs`)])
  .then(([{ data: language }, { data: configs }]) => {
    // locales
    const enLocale = {};
    const cnLocale = {};

    for (let i = 0; i < language.length; i++) {
      cnLocale[language[i].index] = language[i]['zh-CN'];
      enLocale[language[i].index] = language[i]['en-US'];
    }

    const locales = {
      'en-US': {
        ...enLocale,
        ...elementEnLocale,
      },
      'zh-CN': {
        ...cnLocale,
        ...elementCnLocale,
      },
    };


    Vue.use(VueI18n);
    const i18n = new VueI18n({
      locale: 'zh-CN',
      messages: locales,
      dateTimeFormats: {
        'en-US': {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          },
          long: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
          },
        },
        'zh-CN': {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          },
          long: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
          },
        },
      },
    });
    const formater = elementFormat(Vue);
    Vue.use(ElementUI, {
      i18n(path, options) {
        let value = i18n.t(path);
        if (value !== null && value !== undefined) return formater(value, options);
        const array = path.split('.');
        for (let i = 0, j = array.length; i < j; i += 1) {
          const property = array[i];
          value = i18n.t(property);
          if (i === j - 1) return formater(value, options);
          if (!value) return '';
        }
        return '';
      },
    });

    Vue.use(vueAxios, {
      i18n,
      baseUrl: process.env.API_SERVER || '',
    });
    setupI18n(i18n);
    routerHooks(router, i18n);

    // configs
    filters.setAssetServer(configs.assetServer);
    Vue.use(filters);
    store.commit(storeMutationTypes.INIT_CONFIGS, configs);

    const token = store.state.token;
    if (token) {
      const lang = Cookies.get('lang') || 'en-US';
      i18n.locale = lang;
      axios.get('loginWithToken', {})
        .then(({ data: user }) => {
          store.commit(storeMutationTypes.SET_USER, user);
        })
        .catch(() => {
          store.commit(storeMutationTypes.CLEAR_LOGIN_INFO);
        })
        .then(() => {
          setupView(i18n);
        });
    } else {
      setupView(i18n);
    }
  })
  .catch(({ message }) => {
    console.log(message);
  });
