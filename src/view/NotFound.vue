<template>
  <RemoteJs :src="'https://qzone.qq.com/gy/404/data.js'"></RemoteJs>
  <RemoteJs :src="'/src/js/notfoundPage.js'"></RemoteJs>
  <RemoteJs :src="'https://qzone.qq.com/gy/404/style/404style.css'"></RemoteJs>
  <RemoteJs :src="'https://qzonestyle.gtimg.cn/ac/qzfl/stat.js'"></RemoteJs>
  <RemoteJs :src="'/src/js/notFound.js'"></RemoteJs>
</template>

<script>
import RemoteJs from "@/components/common/RemoteJs.vue";
export default {
  components: {
    RemoteJs,
  },
  data() {
    return {};
  }
};
</script>