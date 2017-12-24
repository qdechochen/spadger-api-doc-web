<template>
  <div
    class="file-upload">
    <el-upload ref="upload"
      :action="action"
      :headers="headers"
      :data="data"
      :multiple="limit > 1"
      :list-type="listType"
      :accept="accept"
      :file-list="fileList"
      :before-upload="onBeforeUpload"
      :on-change="onChange"
      :on-preview="onPreview"
      :on-success="onSuccess"
      :on-remove="onRemove">
      <i v-if="listType === 'picture-card'" class="el-icon-plus"></i>
      <template v-else>
        <el-button size="small" type="primary">{{label}}</el-button>
      </template>
      <div slot="tip" class="el-upload__tip">{{tip}}</div>
    </el-upload>
    <el-dialog v-if="listType === 'picture' || listType === 'picture-card'" v-model="previewVisible">
      <img width="100%" :src="previewUrl | remoteAsset" alt="">
    </el-dialog>
  </div>
</template>

<script>
import filters from '@/filters';

const { all: { remoteAsset } } = filters;

const beautifySize = (size) => {
  if (size >= 1000000) {
    return `${size / 1000}GB`;
  } else if (size >= 1000) {
    return `${size / 1000}MB`;
  }
  return `${size}KB`;
};

export default {
  name: 'FileUpload',
  data() {
    return {
      fileList: [],
      previewUrl: '',
      previewVisible: false,
    };
  },
  props: {
    action: {
      type: String,
      required: true,
    },
    value: {
      type: [Array, String],
      default: () => [],
    },
    headers: {},
    data: {},
    listType: {
      type: String,
      default: 'text',
    },
    accept: String,
    label: String,
    tip: String,
    limit: {
      type: Number,
      default: 5,
    },
    maxSize: {
      type: Number,
      default: 5000,
    },
  },
  computed: {
  },
  methods: {
    onBeforeUpload(file) {
      if (this.fileList && this.fileList.length > this.limit) {
        this.$message.error(this.$t('err_file_count_limit', [this.limit]));
        return false;
      }
      const isLTMaxSize = file.size / 1024 < this.maxSize;
      if (!isLTMaxSize) {
        this.$message.error(this.$t('err_file_size_should_be_lt', [beautifySize(this.maxSize)]));
        return false;
      }
      return true;
    },
    onChange(file, fileList) {
      this.fileList = fileList;
    },
    onPreview(file) {
      if (this.listType === 'text') {
        // todo
      } else {
        this.previewUrl = file.url;
        this.previewVisible = true;
      }
    },
    onRemove(file, fileList) {
      const fl = this.reduceFileList(fileList);
      this.$emit('input', fl);
      this.$emit('change', fl);
    },
    onSuccess(res, file, fileList) {
      const fl = this.reduceFileList(fileList);
      this.$emit('input', fl);
      this.$emit('change', fl);
    },
    reduceFileList(fileList) {
      if (this.limit > 1) {
        const reducedList = [];
        fileList.forEach((file) => {
          reducedList.push(file.response[file.name]);
        });

        return reducedList;
      } else if (this.limit === 1 && fileList && fileList.length >= 1) {
        return fileList[0].response[fileList[0].name];
      }

      return null;
    },
    add(list) {
      if (!(list instanceof Array)) {
        if (typeof list === 'string' && list.length > 0) list = [list];
        else list = [];
      }
      list.forEach((url) => {
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        this.fileList.push({
          name: fileName,
          url: remoteAsset(url),
          response: {
            [fileName]: url,
          },
        });
      });

      const fl = this.reduceFileList(this.fileList);
      this.$emit('input', fl);
      this.$emit('change', fl);
    },
    clearFiles() {
      this.fileList = [];
      this.$refs.upload.clearFiles();
    },
  },
  created() {
    this.add(this.value);
  },
};
</script>

<style lang="less" scoped>
.file-upload {
  color:#000;
}
</style>
