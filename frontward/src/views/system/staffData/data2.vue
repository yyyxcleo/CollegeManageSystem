<template>
  <div ref="barChartContainer" :style="{width: '600px', height: '400px'}"></div>
</template>

<script>
import * as echarts from 'echarts';
import {listStu} from "@/api/system/stu";
import {listClass} from "@/api/system/class";
import {listStaff} from "@/api/system/staff";

export default {
  name: 'ClassDistributionBarChart',
  data() {
    return {
      chartInstance: null,
      classData: [
        { className: '一年级A班', studentCount: 30 },
        { className: '一年级B班', studentCount: 25 },
        { className: '二年级A班', studentCount: 80 },
        { className: '二年级B班', studentCount: 45 },
        // 可以继续添加其他班级
      ],
      staffData: []
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  },
  methods: {
    initChart() {
      this.getStuClass()
      this.chartInstance = echarts.init(this.$refs.barChartContainer);
      this.updateChart();
    },
    async getStuClass() {
      try {
        const response = await listStaff(); // 使用await等待Promise resolve
        console.log(response);
        this.staffData = response.rows;
        // console.log("111", this.stuData);
        const classCounts = {};
        this.staffData.forEach(item => {
          if(classCounts[item.staffPost]) {
            classCounts[item.staffPost]++;
          } else {
            classCounts[item.staffPost] = 1;
          }
        });
        this.classData = Object.entries(classCounts).map(([staffPost, postNum]) => ({
          staffPost,
          postNum,
        }));
        console.log(this.classData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    },
    updateChart() {
      const option = {
        title: {
          text: '员工职位统计',
          left: 'center', // 标题位置，居中
          textStyle: {
            fontSize: 30, // 字体大小
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: this.classData.map(item => item.staffPost),
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '学员数量',
            type: 'bar',
            barWidth: '30%',
            data: this.classData.map(item => item.postNum),
          },
        ],
      };

      this.chartInstance.setOption(option);
    },
  },
  watch: {
    classData: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
};
</script>
