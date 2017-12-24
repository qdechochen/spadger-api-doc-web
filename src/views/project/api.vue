<template>
  <div class="wrapper">
    <h1>
      <span v-if="form">{{form.url}}</span>
      <div class="operations">
        <el-button type="danger" size="mini" icon="el-icon-remove-outline"></el-button>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addNew"></el-button>
        <el-button type="primary" size="mini" icon="el-icon-upload" @click="save">{{$t('save')}}</el-button>
      </div>
    </h1>
    <el-form ref="form" :model="form" v-if="form" :rules="rules" label-width="110px" v-loading="isLoading">
      <el-form-item
        :label="$t('url')"
        prop="url"
        :rules="rules.url"
        ref="url"
        :error="errors.url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('title')"
        prop="title"
        :rules="rules.title"
        ref="title"
        :error="errors.title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('introduction')"
        prop="introduction"
        :rules="rules.introduction"
        ref="introduction"
        :error="errors.introduction">
        <el-input type="textarea" v-model="form.introduction"></el-input>
      </el-form-item>
      <h2>{{$t('request')}}</h2>
      <div class="block">
        <el-form-item :label="$t('request_method')">
          <el-radio-group v-model="form.method" @change="requestMethodChanged">
            <el-radio label="GET"></el-radio>
            <el-radio label="POST"></el-radio>
            <el-radio label="PUT"></el-radio>
            <el-radio label="PATCH"></el-radio>
            <el-radio label="DELETE"></el-radio>
            <el-radio label="OPTIONS"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" :content="$t('use_global_tip')" placement="top">
            <el-checkbox v-model="form.request.useGlobal">{{$t('use_global')}}</el-checkbox>
          </el-tooltip>
          <el-select class="panel-select" v-model="requestPanels" multiple :placeholder="$t('pls_select')">
            <el-option
              :label="$t('params')"
              value="params">
            </el-option>
            <el-option
              :label="$t('queries')"
              value="queries">
            </el-option>
            <el-option
              :label="$t('headers')"
              value="headers">
            </el-option>
            <el-option
              :label="$t('cookies')"
              value="cookies">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="requestPanels.includes('params')" :label="$t('params')">
          <kv-composer :value="form.request.params" @change="requestParamsChanged"></kv-composer>
        </el-form-item>
        <el-form-item v-if="requestPanels.includes('queries')" :label="$t('queries')">
          <kv-composer :value="form.request.queries" @change="requestQueriesChanged"></kv-composer>
        </el-form-item>
        <el-form-item v-if="requestPanels.includes('headers')" :label="$t('headers')">
          <kv-composer :value="form.request.headers" @change="requestHeadersChanged"></kv-composer>
        </el-form-item>
        <el-form-item v-if="requestPanels.includes('cookies')" :label="$t('cookies')">
          <kv-composer :value="form.request.cookies" @change="requestCookiesChanged"></kv-composer>
        </el-form-item>
        <el-form-item v-if="['POST', 'PUT', 'PATCH'].includes(form.method)" :label="$t('body')">
          <body-composer :value="form.request.body" @change="requestBodyChanged"></body-composer>
        </el-form-item>
      </div>
      <h2>{{$t('response')}}</h2>
      <div class="block">
        <el-form-item>
          <el-tooltip class="item" :content="$t('use_global_tip')" placement="top">
            <el-checkbox v-model="form.response.useGlobal">{{$t('use_global')}}</el-checkbox>
          </el-tooltip>
          <el-select class="panel-select" v-model="responsePanels" multiple :placeholder="$t('pls_select')">
            <el-option
              :label="$t('headers')"
              value="headers">
            </el-option>
            <el-option
              :label="$t('cookies')"
              value="cookies">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="responsePanels.includes('headers')" :label="$t('headers')">
          <kv-composer :value="form.response.headers" @change="responseHeadersChanged"></kv-composer>
        </el-form-item>
        <el-form-item v-if="responsePanels.includes('cookies')" :label="$t('cookies')">
          <kv-composer :value="form.response.cookies" @change="responseCookiesChanged"></kv-composer>
        </el-form-item>
        <el-form-item :label="$t('body')">
          <el-input-number
            class="status-code"
            controls-position="right"
            size="small"
            :min="200"
            :max="201"
            :step="1"
            v-model="form.response.status"
            :placeholder="$t('status')">
          </el-input-number>
          <body-composer :value="form.response.body" mode="response" @change="responseBodyChanged"></body-composer>
        </el-form-item>
      </div>
      <h2>{{$t('errors')}}</h2>
      <el-form-item>
        <el-tooltip class="item" :content="$t('use_global_tip')" placement="top">
          <el-checkbox v-model="form.useGlobalErrs">{{$t('use_global')}}</el-checkbox>
        </el-tooltip>
      </el-form-item>
      <div v-for="(error, index) in form.errs" :key="JSON.stringify(error)" class="block">
        <el-form-item :label="$t('status_code')">
          <el-input-number
            class="status-code"
            controls-position="right"
            size="small"
            :min="300"
            :max="600"
            :step="1"
            v-model="error.status"
            :placeholder="$t('status')">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('body')">
          <body-composer :value="error.body" mode="error" @change="(v)=>errorBodyChanged(index,v)"></body-composer>
        </el-form-item>
        <i class="el-icon-remove btn-remove" @click="removeError(index)"></i>
      </div>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-fa-plus" @click="addError"></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { resetObject } from '@/utils/tools';
import { requiredValidator } from '@/utils/validators';
import KvComposer from '@/components/project/kv-composer';
import BodyComposer from '@/components/project/body-composer';

export default {
  name: 'Api',
  components: {
    KvComposer,
    BodyComposer,
  },
  data() {
    return {
      apiId: null,
      projectId: null,
      form: null,
      emptyForm: {
        _id: null,
        url: '',
        title: '',
        introduction: '',
        project: null,
        method: 'GET',
        request: {
          params: [],
          queries: [],
          body: null,
          headers: [],
          cookies: [],
          useGlobal: true,
        },
        response: {
          status: 200,
          body: {
            type: 'raw',
            data: {
              type: 'JSON',
              text: '',
            },
          },
          headers: [],
          cookies: [],
          useGlobal: true,
        },
        useGlobalErrs: true,
        errs: [],
      },
      errors: {
        url: null,
        name: null,
        introduction: null,
      },

      requestPanels: ['params', 'queries'],
      responsePanels: [],

      isLoading: false,
    };
  },
  props: {
  },
  computed: {
    rules() {
      return {
        url: [{
          validator: requiredValidator,
          trigger: 'blur',
        }],
        title: [{
          validator: requiredValidator,
          trigger: 'blur',
        }],
        introduction: [{
          validator: requiredValidator,
          trigger: 'blur',
        }],
      };
    },
  },
  methods: {
    resetErrors() {
      resetObject(this.errors);
    },
    addNew() {
      this.$router.push({
        name: 'add-api',
        params: {
          pid: this.projectId,
        },
      });
    },
    fetchTemplate(id) {
      this.isLoading = true;
      this.$axios.get(`apis/${id}`)
        .then(({ data }) => {
          this.form = Object.assign({}, this.emptyForm, data);
          this.form.project = this.form.project._id;
          this.form._id = null;
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
    fetch() {
      this.isLoading = true;
      this.$axios.get(`apis/${this.apiId}`)
        .then(({ data }) => {
          this.form = Object.assign({}, this.emptyForm, data);
          delete this.form.project;
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
    save() {
      this.resetErrors();
      const self = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true;
          let request;
          if (this.form._id) {
            request = this.$axios.patch(`apis/${this.form._id}`, this.form);
          } else {
            request = this.$axios.post('apis', this.form);
          }
          request.then(({ data }) => {
            this.$message({
              type: 'success',
              message: this.$i18n.t('operation_finished'),
            });
            this.$eventHub.$emit('API_UPDATED');
            this.$router.push({
              name: 'view-api',
              params: {
                pid: data.project,
                apiid: data._id,
              },
            });
          })
          .catch(({ errors }) => {
            if (errors) {
              const keys = Object.keys(errors);
              for (let i = 0; i < keys.length; i++) {
                self.editingErrors[keys[i]] = errors[keys[i]];
              }
            }
          })
          .then(() => {
            this.isLoading = false;
          });
        }
      });
    },
    requestMethodChanged() {
    },
    requestParamsChanged(value) {
      this.form.request.params = value;
    },
    requestQueriesChanged(value) {
      this.form.request.queries = value;
    },
    requestHeadersChanged(value) {
      this.form.request.headers = value;
    },
    requestCookiesChanged(value) {
      this.form.request.cookies = value;
    },
    requestBodyChanged(value) {
      this.form.request.body = value;
    },
    responseHeadersChanged(value) {
      this.form.response.headers = value;
    },
    responseCookiesChanged(value) {
      this.form.response.cookies = value;
    },
    responseBodyChanged(value) {
      this.form.response.body = value;
    },
    errorBodyChanged(index, value) {
      this.form.errs[index].body = value;
    },
    add(node) {
      node.push({
        key: '',
        val: '',
        description: '',
      });
    },
    remove(node, index) {
      node.splice(index, 1);
    },
    addError() {
      this.form.errs.push({
        status: '',
        body: {
          type: 'raw',
          data: {
            type: 'JSON',
            text: '',
          },
        },
      });
    },
    removeError(index) {
      this.form.errs.splice(index, 1);
    },
  },
  created() {
    this.projectId = this.$route.params.pid;
    if (this.$route.name === 'add-api') {
      if (this.$route.query.templateApiId) {
        this.fetchTemplate(this.$route.query.templateApiId);
      } else {
        this.form = JSON.parse(JSON.stringify(this.emptyForm));
        this.form.project = this.$route.params.pid;
      }
    } else {
      this.apiId = this.$route.params.apiid;
      this.fetch();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.projectId = to.params.pid;
      if (vm.$route.name === 'add-api') {
        if (to.query.templateApiId) {
          vm.fetchTemplate(to.query.templateApiId);
        } else {
          vm.form = JSON.parse(JSON.stringify(vm.emptyForm));
          vm.form.project = vm.projectId;
        }
      } else {
        vm.apiId = to.params.apiid;
        if (vm.apiId) {
          vm.fetch();
        }
      }
    });
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
  padding:10px 0 20px 0;
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
      height: 10px;
      top: -10px;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      background-color: #f0f0f0;
      width: 100%;
      height: 10px;
      bottom: -10px;;
    }
  }
}
</style>
