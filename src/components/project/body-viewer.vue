<template>
  <div v-if="value">
    <div>
      {{value.type}}
      <span v-if="value.type==='raw'">({{value.data.type}})</span>
      <div class="wrap-text" v-if="value.type === 'empty' && value.data">{{value.data}}</div>
    </div>
    <kv-list
      v-if="value.type === 'form-data' || value.type === 'x-www-form-urlencoded'"
      :value="value.data">
    </kv-list>
    <div class="wrap-text" v-if="value.type === 'binary' && value.data">{{value.data}}</div>
    <div class="wrap-text" v-if="value.type==='raw' && value.data.text">{{value.data.text}}</div>
  </div>
</template>

<script>
import KvList from './kv-list';

export default {
  name: 'BodyViewer',
  components: {
    KvList,
  },
  data() {
    return {
    };
  },
  props: {
    value: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
  created() {
  },
};
</script>

<style lang="less" scoped>
.rawtype-select {
  width: 80px;
}
.wrap-text {
  white-space: pre-wrap;
  word-wrap: wrap;
  line-height: 1.4em;
  border: 1px solid #ccc;
  padding: 6px;
  max-height: 300px;
  overflow: auto;
}
</style>
