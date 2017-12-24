<template>
  <div>
    <el-radio-group v-model="currentValue.type" @change="onChange">
      <el-radio label="empty">empty</el-radio>
      <el-radio label="form-data" v-if="mode === 'request'">form-data</el-radio>
      <el-radio label="x-www-form-urlencoded" v-if="mode === 'request'">x-www-form-urlencoded</el-radio>
      <el-radio label="binary" v-if="mode === 'request' || mode === 'response'">binary</el-radio>
      <el-radio label="raw">raw</el-radio>
    </el-radio-group>
    <el-select
      v-if="currentValue.type==='raw'"
      class="rawtype-select"
      v-model="currentValue.raw.type"
      placeholder="$('pls_select')"
      size="mini"
      @change="onChange">
      <el-option
        v-for="item in rawTypes"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>

    <kv-composer
      v-if="currentValue.type === 'form-data' || currentValue.type === 'x-www-form-urlencoded'"
      :value="currentValue.kvData"
      @change="onKVChange"></kv-composer>
    <el-input
      v-if="currentValue.type === 'binary'"
      v-model="currentValue.binary"
      :placeholder="$t('description')"
      @change="onChange"></el-input>
    <el-input
      v-if="currentValue.type==='raw'"
      type="textarea"
      :rows="8"
      :autosize="{ minRows: 8, maxRows: 16 }"
      v-model="currentValue.raw.text"
      @change="onChange">
    </el-input>
    <el-input
      v-if="currentValue.type==='empty'"
      type="textarea"
      :rows="8"
      :autosize="{ minRows: 8, maxRows: 16 }"
      v-model="currentValue.description"
      @change="onChange">
    </el-input>
  </div>
</template>

<script>
import KvComposer from './kv-composer';

export default {
  name: 'BodyComposer',
  components: {
    KvComposer,
  },
  data() {
    return {
      currentValue: {
        type: 'form-data',
        kvData: [],
        binary: '',
        description: '',
        raw: {
          type: 'JSON',
          text: '',
        },
      },
      types: ['form-data', 'x-www-form-urlencoded', 'raw', 'binary', 'empty'],
      rawTypes: ['Text', 'JSON', 'XML', 'HTML'],
    };
  },
  props: {
    value: {
      type: [Array, Object],
      default() {
        return null;
      },
    },
    mode: {
      type: String,
      default: 'request',
      validator(value) {
        return ['request', 'response', 'error'].includes(value);
      },
    },
  },
  computed: {
  },
  watch: {
    value(value) {
      this.translateValue(value);
    },
  },
  methods: {
    onKVChange(value) {
      this.currentValue.kvData = value;
      this.onChange();
    },
    onChange() {
      const value = this.currentValue;
      let v = {
        type: value.type,
      };
      if (value.type === 'form-data' || value.type === 'x-www-form-urlencoded') {
        v.data = value.kvData;
      } else if (value.type === 'binary') {
        v.data = value.binary;
      } else if (value.type === 'raw') {
        v.data = value.raw;
      } else if (value.type === 'empty') {
        v.data = value.description;
      } else {
        v = {
          type: 'form-data',
          data: [],
        };
      }

      this.$emit('change', v);
      this.$emit('input', v);
    },
    translateValue() {
      if (this.value && this.value.type) {
        this.currentValue.type = this.value.type;
        if (this.currentValue.type === 'form-data' || this.currentValue.type === 'x-www-form-urlencoded') {
          this.currentValue.kvData = JSON.parse(JSON.stringify(this.value.data));
        } else if (this.currentValue.type === 'binary') {
          this.currentValue.binary = this.value.data;
        } else if (this.currentValue.type === 'empty') {
          this.currentValue.description = this.value.data;
        } else {
          this.currentValue.raw = Object.assign({
            contentType: 'JSON',
            text: '',
          }, this.value.data);
        }
      } else {
        this.currentValue.type = 'form-data';
        this.currentValue.kvData = [];
      }
    },
  },
  created() {
    this.translateValue();
  },
};
</script>

<style lang="less" scoped>
.rawtype-select {
  width: 80px;
}
</style>
