<template>
  <div
    :style="{backgroundImage:'url('+url+')'}"
    class="single-picture-upload">
    <el-upload ref="upload"
      :action="action"
      :headers="headers"
      :data="data"
      :show-file-list="false"
      accept=".jpg,.jpeg,.png,.gif"
      :before-upload="onBeforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess">
      <span class="el-upload" v-if="!value&&progress==-1"><i class="el-icon-upload"></i></span>
    </el-upload>
    <el-progress v-if="progress>=0" type="circle" :percentage="parseInt(progress)" class="progress"></el-progress>
    <div v-if="value||progress>=0" class="actions">
      <span @click="onBrowse"><i class="el-icon-upload"></i></span>
      <span v-if="value" @click="onView"><i class="el-icon-view"></i></span>
      <span @click="onDelete"><i class="el-icon-delete2"></i></span>
    </div>
    <div v-if="title" class="title">{{title}}</div>
    <el-dialog v-model="viewVisible">
      <img width="100%" :src="value|remoteAsset" alt="">
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
  name: 'SinglePictureUpload',
  data() {
    return {
      progress: -1,
      fileList: [],
      viewVisible: false,
    };
  },
  props: {
    action: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      value: '',
    },
    value: String,
    headers: {},
    data: {},
    maxSize: {
      type: Number,
      default: 5000,
    },
  },
  computed: {
    url() {
      return remoteAsset(this.value);
    },
  },
  methods: {
    onBeforeUpload(file) {
      const isLTMaxSize = file.size / 1024 < this.maxSize;
      if (!isLTMaxSize) {
        this.$message.error(this.$t('err_file_size_should_be_lt', [beautifySize(this.maxSize)]));
        return false;
      }

      for (let i = 0; i < this.fileList.length; i++) {
        this.$refs.upload.abort(this.fileList[i]);
      }

      this.$emit('input', '');
      this.$emit('change', '');
      this.progress = 0;
      this.fileList.splice(0, this.fileList.length, file);
      return true;
    },
    onSuccess(res, file) {
      this.progress = -1;
      this.$emit('input', res[file.name]);
      this.$emit('change', res[file.name]);
    },
    onProgress(event) {
      this.progress = event.percent;
    },
    onBrowse() {
      if (!this.$refs.upload.disabled) {
        this.$refs.upload.$refs['upload-inner'].$refs.input.click();
      }
    },
    onView() {
      this.viewVisible = true;
    },
    onDelete() {
      for (let i = 0; i < this.fileList.length; i++) {
        this.$refs.upload.abort(this.fileList[i]);
      }

      this.$emit('input', '');
      this.$emit('change', '');
      this.progress = -1;
    },
  },
};
</script>

<style lang="less" scoped>
.single-picture-upload {
  position: relative;
  width:173px;
  height:173px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  background-size:cover;
  background-repeat: no-repeat;
  background-position: center center;
  text-align: center;
  .progress {
    left:17px;
    top:17px;
    position:absolute;
  }
  .el-upload {
    font-size:28px;
    color:#97a8be;
    background-color:#fdfdff;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    line-height: 160px;
  }
  .actions {
    background-color:rgba(0,0,0,0.6);
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    opacity:0;
    color:#fff;
    transition:opacity 0.2s;
    display:flex;
    flex-direction: row;
    justify-content: center;
    font-size: 28px;
    span {
      align-self: center;
      padding:8px;
      cursor: pointer;
    }
  }
  .title {
    width:100%;
    color:#fff;
    position: absolute;
    bottom:0;
    background:rgba(0,0,0,0.5);
  }
  &:hover {
    .actions {
      opacity: 1;
    }
  }
}
</style>
