export default function install(Vue) {
  Vue.mixin({
    mounted() {
      this.$el.onmouseover = (e) => {
        if (e.metaKey || e.altKey) {
          this.$emit('___show_help');
        }
      };
      this.$on('___show_help', () => {
        console.log('___show_help');
      });
    },
  });
}
