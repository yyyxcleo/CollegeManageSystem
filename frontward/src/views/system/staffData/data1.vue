<template>
  <div ref="chartContainer" :style="{width: '600px', height: '400px'}"></div>
</template>

<script>
import * as echarts from 'echarts';
import {listStu} from "@/api/system/stu";
import {listStaff} from "@/api/system/staff";

export default {
  name: 'StudentGenderPieChart',
  data() {
    return {
      chartInstance: null,
      studentGenderData: [
        { gender: '男', count: 0 },
        { gender: '女', count: 0 },
      ],
      queryParams: {
        staffSex: undefined
      }
    };
  },
  async mounted() {
    await this.initAndPopulateChart();
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  },
  methods: {
    async getList(sex) {
      this.queryParams.staffSex = sex;
      try {
        const response = await listStaff(this.queryParams);
        console.log(response)
        switch (sex) {
          case "女":
            this.studentGenderData[1].count = response.rows.length;
            break;
          case "男":
            this.studentGenderData[0].count = response.rows.length;
            break;
        }
        console.log("111");
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    },
    async initAndPopulateChart() {
      await Promise.all([this.getList("女"), this.getList("男")]); // 等待两个异步请求都完成
      console.log("222");
      this.chartInstance = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      const option = {
        title: {
          text: '员工性别统计',
          left: 'center', // 标题位置，居中
          textStyle: {
            fontSize: 30, // 字体大小
          },
          top: 0,
        },
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
      this.chartInstance.setOption(option);
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
