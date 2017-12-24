<template>
  <el-card class="box-card login-card">
    <div slot="header" class="clearfix">
      <span>{{$t('login')}}</span>
    </div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form-login" v-loading="isLoading">
      <el-form-item :label="$t('mobile')" prop="mobile" ref="mobile" :error="errors.mobile">
        <el-input v-model="form.mobile" @change="resetError('mobile')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('password')" prop="password" ref="password" :error="errors.password">
        <el-input type="password" v-model="form.password" @change="resetError('password')" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">{{$t('login')}}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { requiredValidator, lengthValidator, mobileValidator } from '@/utils/validators';
import { PASSWORD_LENGTH } from '@/configs/consts';

export default {
  name: 'Login',
  data() {
    return {
      isLoading: false,
      errors: {
        mobile: null,
        password: null,
      },
      form: {
        mobile: '',
        password: '',
      },
      rules: {
        mobile: [
          { validator: requiredValidator, trigger: 'blur' },
          {
            validator: mobileValidator, trigger: 'blur',
          },
        ],
        password: [
          { validator: requiredValidator, trigger: 'blur' },
          {
            validator: lengthValidator, min: PASSWORD_LENGTH[0], max: PASSWORD_LENGTH[1], trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    resetError(key) {
      this.errors[key] = null;
    },
    submitForm() {
      this.resetErrors();
      const self = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          self.isLoading = true;
          self.$store.dispatch('login', {
            mobile: self.form.mobile,
            password: self.form.password,
          })
          .then(() => this.$router.push({ name: 'projects' }))
          .catch(({ message, fields }) => {
            this.$message({
              type: 'error',
              message: self.$t(message),
            });
            if (fields) {
              for (let i = 0; i < fields.length; i += 1) {
                self.errors[fields[i]] = ' ';
              }
            }
          })
          .then(() => {
            self.isLoading = false;
          });
        }

        return valid;
      });
    },
    resetErrors() {
      Object.keys(this.errors).forEach((value) => { this.errors[value] = null; });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style scoped>
.login-card {
  width:400px;
  margin:0 auto;
}
.form-login {
  padding:30px 60px 0 0;
}
</style>
