<template>
  <div class="avatar-chip" :class="tsize">
    <span class="avatar" :style="{backgroundImage:'url('+url+')'}"></span>
    {{name}}
  </div>
</template>

<script>
export default {
  name: 'AvatarChip',
  props: {
    url: String,
    size: {
      type: String,
      default: 'm',
    },
    name: String,
  },
  computed: {
    tsize() {
      return `avatar-chip-${this.size}`;
    },
  },
};
</script>

<style lang="less" scoped>
.avatar-chip {
  display: inline-block;
  background-repeat: no-repeat;
  background-position: left middle;

  .avatar {
    display: inline-block;
    vertical-align: top;
    background-size: contain;
    border-radius: 50%;
    border:1px solid #ccc;
  }
}
.avatar-chip-s {
  height: 32px;
  line-height:32px;
  .avatar {
    width:32px;
    height:32px;
  }
}
.avatar-chip-m {
  height: 48px;
  line-height:48px;
  .avatar {
    width:48px;
    height:48px;
  }
}
.avatar-chip-l {
  height: 64px;
  line-height:64px;
  .avatar {
    width:64px;
    height:64px;
  }
}
</style>
