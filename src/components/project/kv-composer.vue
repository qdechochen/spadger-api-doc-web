<template>
  <table class="kvtable">
    <tbody>
      <tr v-for="(item, index) in currentValue" :key="index">
        <td><el-input v-model="item.key" @change="keyChanged(index)" :placeholder="$t('key')"></el-input></td>
        <td><el-input v-model="item.type" @change="onChange" :disabled="!item.key" :placeholder="$t('type')"></el-input></td>
        <td>
          <el-input v-model="item.description" @change="onChange" :disabled="!item.key" :placeholder="$t('description')"></el-input>
          <i class="el-icon-remove btn-remove" @click="remove(index)"></i>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'KvComposer',
  components: {
  },
  data() {
    return {
      currentValue: [],
    };
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
  },
  watch: {
    value() {
      this.translateValue();
    },
  },
  methods: {
    onChange() {
      let value;
      if (this.currentValue[this.currentValue.length - 1].key === '') {
        value = this.currentValue.slice(0, this.currentValue.length - 1);
      } else {
        value = this.currentValue;
      }

      this.$emit('change', value);
      this.$emit('input', value);
    },
    keyChanged(index) {
      if (index === this.currentValue.length - 1) {
        this.addNew();
      }
      this.onChange();
    },
    remove(index) {
      this.currentValue.splice(index, 1);
      if (this.value.length === 0) {
        this.addNew();
      }
      this.onChange();
    },
    addNew() {
      this.currentValue.push({
        key: '',
        type: '',
        description: '',
      });
    },
    translateValue() {
      this.currentValue = JSON.parse(JSON.stringify(this.value));
      this.addNew();
    },
  },
  created() {
    this.translateValue();
  },
};
</script>

<style lang="less" scoped>
.kvtable {
  width: 100%;
  line-height: 1.4em;
  thead {
    td {
      font-weight: bold;
    }
  }
  tbody {
    tr {
      td {
        &:first-child {
          width: 200px;
        }
        &:nth-child(2) {
          width: 130px;
        }
        &:last-child {
          position: relative;
          .btn-remove {
            display: none;
            position: absolute;
            left: 100%;
            padding-left: 5px;
            height: 40px;
            font-size: 20px;
            padding:10px 0;
            top: 0;
            color: #F56C6C;
          }
        }
      }
      &:hover {
        td:last-child {
          .btn-remove {
            display: block;
          }
        }
      }
    }
  }
}
</style>
