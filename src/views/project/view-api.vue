<template>
  <div class="wrapper">
    <h1>
      <span v-if="form"><span class="request-method">{{form.method}}</span> {{form.project.apiRoot}}{{form.url}}</span>
      <div class="operations">
        <el-button type="danger" v-if="this.form" size="mini" icon="el-icon-remove-outline" @click="remove"></el-button>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addNew"></el-button>
        <el-button type="primary" v-if="this.form" size="mini" icon="el-icon-fa-copy" @click="duplicate"></el-button>
        <el-button type="primary" v-if="this.form" size="mini" icon="el-icon-edit-outline" @click="edit"></el-button>
      </div>
    </h1>
    <el-form v-if="form" class="view" label-width="110px" v-loading="isLoading">
      <el-form-item :label="$t('title')">
        {{form.title}}
      </el-form-item>
      <el-form-item :label="$t('introduction')">
        <div class="text-paragraph">{{form.introduction}}</div>
      </el-form-item>
      <h2>{{$t('request')}}</h2>
      <div class="block">
        <el-form-item v-if="form.request.params && form.request.params.length>0" :label="$t('params')">
          <kv-list v-if="form.request.params && form.request.params.length>0" :value="form.request.params"></kv-list>
        </el-form-item>
        <el-form-item v-if="(form.request.queries && form.request.queries.length>0) || (form.request.useGlobal && (form.project.request.queries && form.project.request.queries.length>0))" :label="$t('queries')">
          <kv-list v-if="form.request.useGlobal && form.project.request.queries && form.project.request.queries.length>0" :value="form.project.request.queries" :globe="true"></kv-list>
          <kv-list :value="form.request.queries"></kv-list>
        </el-form-item>
        <el-form-item v-if="(form.request.headers && form.request.headers.length>0) || (form.request.useGlobal && (form.project.request.headers && form.project.request.headers.length>0))" :label="$t('headers')">
          <kv-list v-if="form.request.useGlobal && form.project.request.headers && form.project.request.headers.length>0" :value="form.project.request.headers" :globe="true"></kv-list>
          <kv-list :value="form.request.headers"></kv-list>
        </el-form-item>
        <el-form-item v-if="(form.request.cookies && form.request.cookies.length>0) || (form.request.useGlobal && (form.project.request.cookies && form.project.request.cookies.length>0))" :label="$t('cookies')">
          <kv-list v-if="form.request.useGlobal && form.project.request.cookies && form.project.request.cookies.length>0" :value="form.project.request.cookies" :globe="true"></kv-list>
          <kv-list :value="form.request.cookies"></kv-list>
        </el-form-item>
        <el-form-item v-if="['POST', 'PUT', 'PATCH'].includes(form.method)" :label="$t('body')">
          <body-viewer :value="form.request.body"></body-viewer>
        </el-form-item>
      </div>
      <h2>{{$t('response')}}</h2>
      <div class="block">
        <el-form-item :label="$t('status_code')">
          {{form.response.status}}
        </el-form-item>
        <el-form-item v-if="(form.response.headers && form.response.headers.length>0) || (form.response.useGlobal && (form.project.response.headers && form.project.response.headers.length>0))" :label="$t('headers')">
          <kv-list v-if="form.response.useGlobal && form.project.response.headers && form.project.response.headers.length>0" :value="form.project.response.headers" :globe="true"></kv-list>
          <kv-list :value="form.response.headers"></kv-list>
        </el-form-item>
        <el-form-item v-if="(form.response.cookies && form.response.cookies.length>0) || (form.response.useGlobal && (form.project.response.cookies && form.project.response.cookies.length>0))" :label="$t('cookies')">
          <kv-list v-if="form.response.useGlobal && form.project.response.cookies && form.project.response.cookies.length>0" :value="form.project.response.cookies" :globe="true"></kv-list>
          <kv-list :value="form.response.cookies"></kv-list>
        </el-form-item>
        <el-form-item :label="$t('body')">
          <body-viewer :value="form.response.body"></body-viewer>
        </el-form-item>
      </div>
      <template v-if="">
        <h2>{{$t('errors')}}</h2>
        <div v-if="form.useGlobalErrs && form.project.errs && form.project.errs.length>0" v-for="(error, index) in form.project.errs" :key="index" class="block">
          <el-form-item>
            <template slot="label"><i class="el-icon-fa-globe"></i> {{error.status}}</template>
            <body-viewer :value="error.body"></body-viewer>
          </el-form-item>
        </div>
        <div v-if="form.errs && form.errs.length>0" v-for="(error, index) in form.errs" :key="index" class="block">
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
  name: 'ViewApi',
  components: {
    KvList,
    BodyViewer,
  },
  data() {
    return {
      projectId: null,
      apiId: null,
      form: null,
      isLoading: false,
    };
  },
  props: {
    id: String,
  },
  computed: {
  },
  methods: {
    addNew() {
      this.$router.push({
        name: 'add-api',
        params: {
          pid: this.projectId,
        },
      });
    },
    duplicate() {
      this.$router.push({
        name: 'add-api',
        params: {
          pid: this.projectId,
        },
        query: {
          templateApiId: this.apiId,
        },
      });
    },
    edit() {
      this.$router.push({
        name: 'edit-api',
        params: {
          pid: this.projectId,
          apiid: this.apiId,
        },
      });
    },
    remove() {

    },
    fetch() {
      this.isLoading = true;
      this.$axios.get(`apis/${this.apiId}`)
        .then(({ data }) => {
          this.form = data;
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
    this.apiId = this.$route.params.apiid;
    this.projectId = this.$route.params.pid;
    if (this.apiId) {
      this.fetch();
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.apiId = to.params.apiid;
    this.projectId = to.params.pid;
    if (this.apiId) {
      this.fetch();
    }
    next();
  },
};
</script>

<style lang="less" scoped>
h1 {
  margin:0;
  min-height: 30px;
  padding-top: 6px;
  padding-bottom:6px;
  border-bottom: 1px solid #ccc;
  margin-bottom:20px;
  position: sticky;
  top: 0;
  background-color:#fff;
  z-index: 9;
  .request-method {
    border: 1px solid #ccc;
    padding:0 2px;
    background-color: #ccc;
    color:#fff;
  }
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
  padding:30px 0 10px 0;
}
.panel-select {
  float:right;
  width: 500px;
}
.status-code {
  width: 100px;
}
.block {
  position: relative;
  .btn-remove {
    display: none;
    position: absolute;
    left: 100%;
    padding-left: 5px;
    height: 40px;
    font-size: 20px;
    padding:10px 0;
    top: 50%;
    margin-top: -20px;
    color: #F56C6C;
  }
  &:hover {
    background-color: #f0f0f0;
    .btn-remove {
      display: block;
    }
    &:before {
      content: "";
      display: block;
      position: absolute;
      background-color: #f0f0f0;
      width: 100%;
      height: 6px;
      top: -6px;;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      background-color: #f0f0f0;
      width: 100%;
      height: 6px;
      bottom: -6px;;
    }
  }
}
</style>
