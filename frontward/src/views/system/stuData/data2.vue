<template>
  <div ref="barChartContainer" :style="{width: '600px', height: '400px'}"></div>
</template>

<script>
import * as echarts from 'echarts';
import {listStu} from "@/api/system/stu";
import {listClass} from "@/api/system/class";

export default {
  name: 'ClassDistributionBarChart',
  data() {
    return {
      chartInstance: null,
      stuData: [
        // 可以继续添加其他班级
      ],
      classData: [],
      classList: []
    };
  },
  mounted() {
    this.initChart();
  },
  created() {
    this.getList();
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  },
  methods: {
    getList() {
      listStu().then(response => {
        console.log(response)
        this.stuData = response.rows
        console.log("111",this.stuData)
      })
      listClass().then(response => {
        this.classList = response.rows
      })
    },
    getClassName(id) {
      // console.log(id===2)
      const cl = this.classList.find(item => item.classId == id);
      // console.log(cl.classId)
      return cl ? cl.className : '';
    },
    async getStuClass() {
      try {
        const response = await listStu(); // 使用await等待Promise resolve
        console.log(response);
        this.stuData = response.rows;
        // console.log("111", this.stuData);
        const res = await listClass();
        this.classList = res.rows;
        const classCounts = {};
        this.stuData.forEach(item => {
          if(classCounts[this.getClassName(item.stuClass)]) {
            classCounts[this.getClassName(item.stuClass)]++;
          } else {
            classCounts[this.getClassName(item.stuClass)] = 1;
          }
        });
        this.classData = Object.entries(classCounts).map(([className, classNum]) => ({
          className,
          classNum,
        }));
        console.log(this.classData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    },
    initChart() {
      this.getList();
      this.getStuClass();
      this.chartInstance = echarts.init(this.$refs.barChartContainer);
      this.updateChart();
    },
    updateChart() {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: this.classData.map(item => item.className),
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
            data: this.classData.map(item => item.classNum),
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
