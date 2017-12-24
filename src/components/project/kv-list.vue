<template>
  <table class="kvtable">
    <tbody>
      <tr v-for="(item, index) in value" :key="index">
        <td><i v-if="globe" class="el-icon-fa-globe"></i> {{item.key}}</td>
        <td>{{item.type}}</td>
        <td>{{item.description}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'KvList',
  components: {
  },
  data() {
    return {
    };
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    globe: {
      type: Boolean,
      default: false,
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
.kvtable {
  width: 100%;
  line-height: 34px;
  border: 1px solid #ddd;
  border-spacing: 0;
  border-collapse: collapse;
  thead {
    td {
      font-weight: bold;
      border: 1px solid #ddd;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
  tbody {
    tr {
      td {
        border: 1px solid #ddd;
        padding-left: 5px;
        padding-right: 5px;
        &:first-child {
          width: 200px;
        }
        &:nth-child(2) {
          width: 130px;
        }
      }
    }
  }
}
</style>
