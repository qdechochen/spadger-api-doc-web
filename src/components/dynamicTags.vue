<template>
  <div>
    <el-tag
      :key="tag"
      v-for="tag in tags"
      :closable="true"
      :close-transition="false"
      @close="handleClose(tag)"
    >
    {{tag}}
    </el-tag>
    <el-input
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      class="new-tag-input"
      :placeholder="newTagLabel"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'DynamicTags',
  props: {
    tags: {
      type: Array,
      default: [],
    },
    newTagLabel: '',
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
    };
  },
  methods: {
    handleClose(tag) {
      const tags = this.tags;
      tags.splice(tags.indexOf(tag), 1);
      this.$emit('input', tags);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputValue) {
        const tags = this.tags;
        tags.push(this.inputValue);
        this.$emit('input', tags);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin-right:10px;
}
.new-tag-input {
  display: inline-block;
  width:120px;
}
</style>
