<template>
  <div class="wrapper">
    <h1>
      <div class="operations">
        <el-button type="primary" size="mini" icon="el-icon-upload" @click="save">{{$t('save')}}</el-button>
      </div>
    </h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="isLoading">
      <template  v-if="form">
        <el-form-item :label="$t('name')">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('introduction')">
          <el-input type="textarea" v-model="form.introduction"></el-input>
        </el-form-item>
        <el-form-item :label="$t('api_root')">
          <el-input v-model="form.apiRoot"></el-input>
        </el-form-item>
        <h2>{{$t('request')}}</h2>
        <el-form-item :label="$t('queries')">
          <kv-composer v-model="form.request.queries"></kv-composer>
        </el-form-item>
        <el-form-item :label="$t('headers')">
          <kv-composer v-model="form.request.headers"></kv-composer>
        </el-form-item>
        <el-form-item :label="$t('cookies')">
          <kv-composer v-model="form.request.cookies"></kv-composer>
        </el-form-item>
        <h2>{{$t('response')}}</h2>
        <div class="block">
          <el-form-item :label="$t('headers')">
            <kv-composer v-model="form.response.headers"></kv-composer>
          </el-form-item>
          <el-form-item :label="$t('cookies')">
            <kv-composer v-model="form.response.cookies"></kv-composer>
          </el-form-item>
        </div>
        <h2>{{$t('errors')}}</h2>
        <div v-for="(error, index) in form.errs" :key="index" class="block">
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
            <body-composer v-model="error.body" mode="error"></body-composer>
          </el-form-item>
          <i class="el-icon-remove btn-remove" @click="removeError(index)"></i>
        </div>
        <el-form-item>
          <el-button type="primary" size="mini" icon="el-icon-fa-plus" @click="addError"></el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { resetObject } from '@/utils/tools';
import { requiredValidator } from '@/utils/validators';
import KvComposer from '@/components/project/kv-composer';
import BodyComposer from '@/components/project/body-composer';

export default {
  name: 'EditConfigurations',
  components: {
    KvComposer,
    BodyComposer,
  },
  data() {
    return {
      projectId: null,
      form: null,
      emptyForm: {
        _id: null,
        name: '',
        introduction: '',
        apiRoot: '/',
        request: {
          queries: [],
          body: null,
          headers: [],
          cookies: [],
        },
        response: {
          headers: [],
          cookies: [],
        },
        errs: [],
      },
      errors: {
        name: null,
        introduction: null,
      },

      isLoading: false,
    };
  },
  props: {
  },
  computed: {
    rules() {
      return {
        name: [{
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
    save() {
      this.resetErrors();
      const self = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true;
          let request;
          if (this.form._id) {
            request = this.$axios.patch(`projects/${this.form._id}`, this.form);
          } else {
            request = this.$axios.post('projects', this.form);
          }
          request.then(({ data }) => {
            this.$message({
              type: 'success',
              message: this.$i18n.t('operation_finished'),
            });
            this.$router.push(`/projects/${data._id}`);
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
    requestQueriesChanged(value) {
      this.form.request.queries = value;
    },
    requestHeadersChanged(value) {
      this.form.request.headers = value;
    },
    requestCookiesChanged(value) {
      this.form.request.cookies = value;
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
    if (this.$route.params.pid === 'new') {
      this.form = this.emptyForm;
    } else {
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
  padding:10px 0 20px 0;
}
.panel-select {
  float:right;
  width: 500px;
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
