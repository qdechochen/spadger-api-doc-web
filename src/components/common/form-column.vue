<template>
  <div class="form-column" :style="{width: width+'px'}">
    <label v-if="title">{{title}}</label>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FormColumn',
  props: {
    title: '',
    width: {
      type: [Number, String],
      default: 500,
    },
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
.form-column {
  margin:0 15px;
  flex-shrink:0;
  flex-grow:0;
  display:inline-block;
  >label {
    font-size:18px;
    font-weight:bold;
  }
}
</style>
