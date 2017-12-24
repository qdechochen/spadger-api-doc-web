<template>
  <section class="vscroll-container">
    <section class="header" v-if="hasHeader">
      <slot name="header"></slot>
    </section>
    <section class="content">
      <slot></slot>
    </section>
    <section class="footer" v-if="hasFooter">
      <slot name="footer"></slot>
    </section>
  </section>
</template>

<script>
export default {
  name: 'VscrollLayout',
  components: {
  },
  data() {
    return {
      hasHeader: false,
      hasFooter: false,
    };
  },
  methods: {
  },
  computed: {
  },
  created() {
    if (this.$slots.header) this.hasHeader = true;
    if (this.$slots.footer) this.hasFooter = true;
  },
};
</script>

<style lang="less" scoped>
.vscroll-container {
  display:flex;
  flex-direction:column;
  height:100%;

  >.header,
  >.footer {
    flex-shrink: 0;
    flex-grow:0;
    padding:8px 0;
  }

  >.header {
    border-bottom:1px solid #d1e3e5;
  }
  >.footer {
    text-align:center;
    border-top:1px solid #d1e3e5;
  }

  >.content{
    flex-shrink:1;
    flex-grow:1;
    height:100%;
    overflow-y: auto;
    padding:12px 2px;
  }
}
</style>
