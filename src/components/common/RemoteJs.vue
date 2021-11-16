<template>
</template>
<script>
export default {
  props: {
    src: { type: String, required: true },
  },
  mounted(){
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = this.src
      document.head.appendChild(script)
  }
};
</script>