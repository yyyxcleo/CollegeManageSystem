<template>
  <div ref="chartContainer" :style="{width: '600px', height: '400px'}"></div>
</template>

<script>
import * as echarts from 'echarts';
import {listStu} from "@/api/system/stu";
export default {
  name: 'StudentGenderPieChart',
  data() {
    return {
      chartInstance: null,
      studentGenderData: [
        { gender: '男', count: 25 },
        { gender: '女', count: 35 },
        // 可以添加更多类别，例如'未知'等
      ],
      queryParams:{
        stuSex: undefined
      }
    };
  },
  created() {
    this.getList()
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
    getList() {
      this.queryParams.stuSex = "0";
      listStu(this.queryParams).then(response => {
        this.studentGenderData[1].count = response.rows.length
      })
      this.queryParams.stuSex = "1";
      listStu(this.queryParams).then(response => {
        console.log(response)
        this.studentGenderData[0].count = response.rows.length
      })
    },
    initChart() {
      this.getList()
      console.log(this.studentGenderData[0].count)
      this.chartInstance = this.$refs.chartContainer;
      this.updateChart();
    },
    updateChart() {
      const myChart = echarts.init(this.chartInstance);
      const option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: '学生性别统计',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: this.studentGenderData.map(item => ({ value: item.count, name: item.gender })),
          },
        ],
      };

      myChart.setOption(option);
    },
  },
  watch: {
    studentGenderData: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
};
</script>
