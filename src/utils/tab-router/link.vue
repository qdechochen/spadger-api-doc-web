<template>
  <a :href="to" :target="target" @click="click">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'TabRouterLink',
  components: {
  },
  props: {
    to: {
      type: String,
      default: '/',
    },
    target: {
      type: String,
      default: 'default',
    },
    params: {
      default: () => ({}),
    },
    hooks: {
      default: () => ({}),
    },
    onTabOpen: null,
    onTabFinish: null,
    onTabClose: null,
    onTabAbort: null,
  },
  methods: {
    click(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      this.$tabRouter.open({
        path: this.to,
        target: this.target,
        params: this.params,
        hooks: this.hooks,
        onTabOpen: this.onTabOpen,
        onTabAbort: this.onTabAbort,
        onTabFinish: this.onTabFinish,
        onTabClose: this.onTabClose,
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
