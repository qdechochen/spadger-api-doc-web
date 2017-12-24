export let _Vue;

function closeTab(target = 'default') {
  let pane = this.$parent;
  let tabRouterView = pane.$parent.$parent;
  while (pane.$options._componentTag !== 'tab-pane' && !tabRouterView.tabRouter && tabRouterView.name !== target) {
    pane = pane.$parent;
    tabRouterView = tabRouterView.$parent;
    if (!tabRouterView) break;
  }
  if (tabRouterView) {
    tabRouterView.removeTab(pane.name);
  }
}
function openTab({ path, target = 'default', params = {} }) {
  this.$tabRouter.open({ path, target, params });
}

export function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  _Vue = Vue;

  Object.defineProperty(Vue.prototype, '$tabRouter', {
    get() { return this.$root._tabRouter; },
  });

  Vue.mixin({
    beforeCreate() {
      // install TabRouter, usually this happends in root app node
      if (this.$options.tabRouter !== undefined) {
        this._tabRouter = this.$options.tabRouter;
      }
    },
    destroyed() {
    },
    methods: {
      closeTab,
      openTab,
    },
  });
}
