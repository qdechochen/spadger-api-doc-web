export default {
  data() {
    return {
      $isFinished: false,
    };
  },
  created() {
    this.$emit('open');
  },
  destroyed() {
    this.$emit(this.$isFinished ? 'finish' : 'close');
  },
};
