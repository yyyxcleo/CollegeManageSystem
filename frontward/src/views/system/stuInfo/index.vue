<template>
  <div class="stuinfo">
    <data1/>
    <data2/>
  </div>
</template>

<script>
import data1 from '@/views/system/stuData/data1.vue'
import data2 from '@/views/system/stuData/data2.vue'
export default {
  name: "index",
  components:{
    data1,
    data2
  }
}
</script>

<style scoped>
.stuinfo{
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 分布间距相等 */
  width: 50%;

  margin-left: 25%;
  margin-top: 15%;/* 确保容器宽度为100%，可根据实际情况调整 */
}

/* 可选：如果需要给每个子组件设定宽度或其他样式 */
.data1, .data2 {
  flex: 1; /* 让两个组件自适应容器宽度 */
  /* 或者可以指定宽度，例如：width: 48%; 来让两边有小间距 */
}
</style>
