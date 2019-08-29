<template>
  <a-row>
    <div id="echarts" :style="{width: '100%', height: '400px'}"></div>
  </a-row>
</template>

<script>
import flare from './flare.json'
export default {
  data() {
    return {
      flare
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      const dom = document.getElementById('echarts')
      const myEcharts = this.echarts.init(dom)
      const data = this.flare
      myEcharts.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: function (params) { // 连接线上提示文字格式化
            const result = `<div><p>订单进度</p><p>2019年7月30日13点47分</p><p>${params.name}</p></div>`
            return result
          }
        },
        series: [
          {
            name: '订单进度',
            type: 'tree',
            data: [data],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 10,
            label: {
              normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 12,
                formatter: (params) => {
                  const val = `${params.name}\n${params.data.time}\n${params.data.num}/${params.data.allNum}`
                  return val
                }
              }
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      })
    }
  }
}
</script>

<style>
</style>
