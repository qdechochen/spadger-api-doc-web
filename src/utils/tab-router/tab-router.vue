<script>
export default {
  name: 'TabRouterView',
  components: {
  },
  props: {
    name: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      pages: {},
      activeHash: null,
    };
  },
  computed: {
    tabRouter() {
      return this.$root._tabRouter;
    },
  },
  methods: {
    open(page) {
      page = Object.assign({
        path: null,
        target: null,
        params: {},
        hooks: {},
        onTabOpen: null,
        onTabFinish: null,
        onTabClose: null,
        onTabAbort: null,
      }, page);
      if (this.activeHash === page.hash) {
        console.warn('ignore: tried to open self page');
      } else if (this.pages[page.hash]) {
        this.activeHash = page.hash;
      } else {
        for (let i = 0; i < this.tabRouter.routes.length; i++) {
          if (this.tabRouter.routes[i].path === page.path) {
            page.route = this.tabRouter.routes[i];
            break;
          }
        }
        if (page.route) {
          if (typeof page.onTabOpen === 'function') page.hooks.open = page.onTabOpen;
          if (typeof page.onTabFinish === 'function') page.hooks.finish = page.onTabFinish;
          if (typeof page.onTabClose === 'function') page.hooks.close = page.onTabClose;
          this.$set(this.pages, page.hash, page);
          this.activeHash = page.hash;
        } else if (typeof page.onTabAbort === 'function') {
          console.log('tab route aborted: route not found');
          page.onTabAbort('tab route aborted: route not found');
        }
      }
    },
    removeTab(hash) {
      const keys = Object.keys(this.pages);
      if (keys.length === 0 || !keys.includes(hash)) return;
      if (keys.length === 1) {
        this.activeHash = null;
      } else {
        let nextHash;
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] === hash) {
            if (i + 1 < keys.length) {
              nextHash = keys[i + 1];
            } else {
              nextHash = keys[i - 1];
            }

            break;
          }
        }
        if (hash === this.activeHash) this.activeHash = nextHash;
      }

      this.$delete(this.pages, hash);
    },
  },
  created() {
    this.tabRouter.register(this.name, this);
  },
  render(h) {
    const self = this;
    const panes = [];
    for (const hash in self.pages) {
      const page = self.pages[hash];
      panes.push(h('el-tab-pane', {
        props: {
          label: self.$t(page.route.label),
          closable: true,
          name: page.hash,
        },
        key: page.hash,
        scopedSlots: {
          default() {
            return h(page.route.component, {
              props: page.params,
              on: page.hooks,
            });
          },
        },
      }));
    }

    return h('el-tabs', {
      class: {
        'el-router-tabs': true,
      },
      props: {
        type: 'border-card',
        closable: true,
        value: self.activeHash,
      },
      on: {
        'tab-remove': self.removeTab,
        input(hash) {
          self.activeHash = hash;
        },
      },
    },
    panes,
  );
  },
};
</script>

<style lang="less" scoped>
</style>
