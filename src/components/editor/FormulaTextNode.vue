<template>
  <span @click="$emit('moveCursor', node)" v-html="text"></span>
</template>
<script>
export default {
  name: 'FormulaTextNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    cursor: { type: Object},
    prevCursor: { type: Object},
  },
  computed: {
    text() {
      return this.node.exportChar || this.node.value
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  },
}
</script>