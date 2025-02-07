<template>
  <div class="staffinfo">
    <data1/>
    <data2/>
  </div>
</template>

<script>
import data1 from '@/views/system/staffData/data1.vue'
import data2 from '@/views/system/staffData/data2.vue'
export default {
  name: "index",
  components:{
    data1,
    data2
  }
}
</script>

<style scoped>
.staffinfo{
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 分布间距相等 */
  width: 50%;

  margin-left: 25%;
  margin-top: 15%;/* 确保容器宽度为100%，可根据实际情况调整 */
}

</style>
