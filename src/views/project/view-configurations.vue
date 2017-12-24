<template>
  <div>
    <h1>
      <span v-if="form">{{form.name}}</span>
      <div class="operations">
        <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click="onEdit"></el-button>
      </div>
    </h1>
    <el-form class="view" label-width="80px" v-loading="isLoading">
      <template  v-if="form">
        <div>
          {{form.introduction}}
        </div>
        <el-form-item :label="$t('api_root')">
          {{form.apiRoot}}
        </el-form-item>
        <h2>{{$t('request')}}</h2>
        <el-form-item v-if="form.request.queries && form.request.queries.length>0" :label="$t('queries')">
          <kv-list :value="form.request.queries"></kv-list>
        </el-form-item>
        <el-form-item v-if="form.request.headers && form.request.headers.length>0" :label="$t('headers')">
          <kv-list :value="form.request.headers"></kv-list>
        </el-form-item>
        <el-form-item v-if="form.request.cookies && form.request.cookies.length>0" :label="$t('cookies')">
          <kv-list :value="form.request.cookies"></kv-list>
        </el-form-item>
        <h2>{{$t('response')}}</h2>
        <div class="block">
          <el-form-item v-if="form.response.headers && form.response.headers.length>0" :label="$t('headers')">
            <kv-list :value="form.response.headers"></kv-list>
          </el-form-item>
          <el-form-item v-if="form.response.cookies && form.response.cookies.length>0" :label="$t('cookies')">
            <kv-list :value="form.response.cookies"></kv-list>
          </el-form-item>
        </div>
        <h2>{{$t('errors')}}</h2>
        <div v-for="(error, index) in form.errs" :key="index" class="block">
          <el-form-item :label="`${error.status}`">
            <body-viewer :value="error.body"></body-viewer>
          </el-form-item>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
import KvList from '@/components/project/kv-list';
import BodyViewer from '@/components/project/body-viewer';

export default {
  name: 'ProjectConfigurations',
  components: {
    KvList,
    BodyViewer,
  },
  data() {
    return {
      projectId: null,
      form: null,

      isLoading: false,
    };
  },
  props: {
  },
  computed: {
  },
  methods: {
    onEdit() {
      this.$router.push({
        name: 'edit-project',
        params: {
          pid: this.projectId,
        },
      });
    },
    fetch() {
      this.isLoading = true;
      this.$axios.get(`projects/${this.projectId}`)
        .then(({ data }) => {
          this.form = Object.assign({}, this.emptyForm, data);
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('failed_fetching_data'),
          });
        })
        .then(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    if (this.$route.params.pid) {
      this.projectId = this.$route.params.pid;
      this.fetch();
    }
  },
};
</script>

<style lang="less" scoped>

h1 {
  margin:0;
  min-height: 30px;
  padding-bottom:6px;
  border-bottom: 1px solid #ccc;
  margin-bottom:20px;
  position: sticky;
  top: 0;
  background-color:#fff;
  z-index: 9;
  .operations {
    float: right;
    .el-button {
      padding-right: 8px;
      padding-left: 8px;
    }
  }
}
h2 {
  font-size:16px;
  margin: 0;
  text-align: center;
  padding:20px 0 10px 0;
}
</style>
