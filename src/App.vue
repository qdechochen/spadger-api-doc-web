<template>
  <div id="app">
    <el-container class="el-container-main" direction="vertical">
      <app-nav v-if="user"></app-nav>
      <el-main>
        <router-view class="view"></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import AppNav from '@/components/common/app-nav';

import '@/assets/spadger.less';


export default {
  name: 'app',
  components: {
    AppNav,
  },
  data() {
    return {
    };
  },
  props: {
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    lang: {
      get() {
        return this._i18n.locale;
      },
      set(newValue) {
        this._i18n.locale = newValue;
        this.$store.dispatch('setLang', newValue);
      },
    },
  },
  methods: {
  },
  created() {
    let result = window.location.href.match(new RegExp('[?&]lang=([^&]+)#{0,1}', 'i'));
    if (result == null || result.length < 1) {
      result = null;
    } else {
      result = result[1];
    }

    if (result) {
      if (result === 'zh-CN') {
        this.lang = 'zh-CN';
      } else {
        this.lang = 'en-US';
      }
    } else {
      this.lang = this.$store.state.lang;
    }

    if (localStorage.getItem('token')) {
      this.isTryingLogin = true;
      const loading = this.$loading({
        body: true,
        fullscreen: true,
        lock: true,
        text: '尝试自动登录中...',
      });
      this.$store.dispatch('setToken', localStorage.getItem('token'));
      this.$store.dispatch('loginWithToken')
      .then(() => {
        this.$message({
          type: 'success',
          message: '自动登录成功',
        });
      })
      .catch(() => {
        this.$message({
          type: 'warning',
          message: '自动登录失败',
        });
      })
      .then(() => {
        this.isTryingLogin = false;
        loading.close();
      });
    }
  },
};
</script>
<style lang="less" scoped>
.el-container.el-container-main {
  >.el-main {
    padding-right:0;
  }
}
</style>
