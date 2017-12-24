<template>
  <section class="main-layout" :class="{'has-aside': hasAside, 'hide-aside': hasAside && !showAside }">
    <section>
      <slot></slot>
    </section>
    <aside v-if="hasAside">
      <div v-if="hasAside" class="aside-switch" @click="toggleAside">
        <i v-if="!showAside" class="el-icon-caret-left"></i>
        <i v-if="showAside" class="el-icon-caret-right"></i>
      </div>
      <slot name="aside"></slot>
    </aside>
  </section>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {
  },
  data() {
    return {
      showAside: true,
      hasAside: false,
    };
  },
  methods: {
    toggleAside() {
      this.showAside = !this.showAside;
    },
  },
  computed: {
  },
  created() {
    if (this.$slots.aside) this.hasAside = true;
  },
};
</script>

<style lang="less" scoped>
</style>
