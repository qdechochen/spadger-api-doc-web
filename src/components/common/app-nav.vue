
<template>
  <el-header height="60">
    <h1>Spadger</h1>
    <el-menu mode="horizontal">
      <el-menu-item index="/projects" @click="router"><i class="el-icon-fa-file-code-o"></i>{{$t('projects')}}</el-menu-item>
      <el-menu-item index="/system/languages" @click="router"><i class="el-icon-fa-language"></i>{{$t('languages')}}</el-menu-item>
      <el-menu-item index="about" @click="showAbout"><i class="el-icon-fa-exclamation-circle"></i>{{$t('about')}}</el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <avatar-chip :url="user.avatar | remoteAsset" size="s" :name="user.name" />
        </template>
        <el-menu-item index="logout">{{$t('logout')}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-header>
</template>

<script>
import AvatarChip from '@/components/common/avatar-chip';
import { APP } from '@/configs/consts';

export default {
  name: 'AppNav',
  components: {
    AvatarChip,
  },
  data() {
    return {
      isShowFeedback: false,
      isFeedbackSubmitting: false,
    };
  },
  props: {
  },
  computed: {
    app() {
      return APP;
    },
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
    router(menuItem) {
      this.$router.push(menuItem.index);
    },
    switchToChinese() {
      this.lang = 'zh-CN';
    },
    switchToEnglish() {
      this.lang = 'en-US';
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
    showAbout() {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t('about'),
        message: h('div', null, [
          h('p', null, [
            h('span', null, this.app.name),
            ' ',
            h('span', null, this.app.version),
          ]),
          h('p', null, [
            h('span', null, 'Email: '),
            h('a', { attrs: { href: `mailto:${this.app.email}` } }, this.app.email),
          ]),
        ]),
        showCancelButton: false,
        confirmButtonText: this.$t('OK'),
      });
    },
  },
};
</script>
<style lang="less" scoped>
header {
  border-bottom: solid 1px #e6e6e6;
}
h1 {
  float: left;
  margin: 15px 0;
}
.el-menu {
  float: right;
  border: none;
}
</style>
