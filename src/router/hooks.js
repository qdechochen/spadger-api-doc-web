import store from '@/store';
import { Notification } from 'element-ui';

let _i18n;

const hasPower = function hasPower(target) {
  let pass = false;
  if (target === false) {
    pass = true;
  } else if (target === 'login') {
    pass = !!store.state.token;
  }

  return pass;
};

const hooks = {
  beforeEach: (to, from, next) => {
    if (hasPower(to.meta.auth)) {
      next();
    } else if (!store.state.token) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      Notification.error({
        title: _i18n.t('error'),
        message: _i18n.t('err_forbidden'),
      });
    }
  },
};

function attach(router, i18n) {
  _i18n = i18n;
  if (hooks.beforeEach) {
    router.beforeEach(hooks.beforeEach);
  }
}

export default attach;
