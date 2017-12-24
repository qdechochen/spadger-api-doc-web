import hash from 'object-hash';
import { install } from './install';

export default class TabRouter {
  constructor(options) {
    this.options = options;
    this.routes = options.routes;
    this.targets = {};

    // private attrs
    this._pages = [];
    this._activePage = null;
  }

  get pages() {
    return this._pages;
  }
  get activePage() {
    return this._activePage;
  }

  register(name, ref) {
    if (!name) name = 'default';
    if (!this.targets[name]) {
      this.targets[name] = ref;
    } else {
      console.warn('duplicated tab router view');
    }
  }

  open(page) {
    if (typeof page === 'string') {
      page = {
        path: page,
      };
    }
    page = Object.assign({
      target: 'default',
      path: '',
      params: {},
      unique: true,
      hooks: null,
      onTabOpen: null,
      onTabAbort: null,
      onTabFinish: null,
      onTabClose: null,
    }, page);
    page.hash = hash.sha1(page.path + (page.unique ? '' : Math.random()));

    const targetRef = this.targets[page.target];
    if (targetRef) {
      targetRef.open(page);
    } else {
      console.error('tab router target view not found');
      if (typeof page.onTabAbort === 'function') {
        page.onTabAbort('target view not found');
      }
    }
  }
}

TabRouter.install = install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(TabRouter);
}
