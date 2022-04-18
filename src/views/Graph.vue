<template>
  <Layout>
    <Tabs class="tabs" class-prefix="type"
          :data-source="recordTypeList" :value.sync="type"/>
    <template v-if="type === '-'">
      <div class="selected">支出统计</div>
    </template>
    <template v-else>
      <div class="selected">收入统计</div>
    </template>
    <div class="money-chart-wrapper" ref="moneyChartWrapper">
      <Chart class="money-chart" :options="chartOptions"/>
    </div>
    <template v-if="type === '-'">
      <div class="selected">支出占比</div>
    </template>
    <template v-else>
      <div class="selected">收入占比</div>
    </template>
    <div v-if="pieChartList.length>0">
    <Chart class="tag-chart" :options="tagChartOptions"/>
    </div>
    <div v-else class="noResult">
      目前没有相关记录
    </div>
  </Layout>
</template>


<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Tabs from '@/components/Tabs.vue';
import recordTypeList from '@/constants/recordTypeList';
import clone from '@/lib/clone';
import Chart from '@/components/Chart.vue';
import _ from 'lodash';
import day from 'dayjs';
import createdAtList from '@/lib/createdAtList';


@Component({
  name: 'HelloWorld',
  components: {Tabs, Chart},
})
export default class Statistics extends Vue {

  mounted() {
    const div = (this.$refs.moneyChartWrapper as HTMLDivElement);
    div.scrollLeft = div.scrollWidth;
  }


  get keyValueList() {
    const today = new Date();
    const array = [];
    for (let i = 0; i <= 29; i++) {
      const dateString = day(today).subtract(i, 'day').format('YYYY-MM-DD');
      const found = _.find(this.groupedList, {
        title: dateString
      });
      array.push({
        key: dateString, value: found ? found.total : 0
      });
    }
    array.sort((a, b) => {
      if (a.key > b.key) {
        return 1;
      } else if (a.key === b.key) {
        return 0;
      } else {
        return -1;
      }
    });
    return array;
  }

  get chartOptions() {
    const keys = this.keyValueList.map(item => item.key);
    const values = this.keyValueList.map(item => item.value);
    return {
      grid: {
        top: 20,
        left: 0,
        right: 0,
        bottom: 30
      },
      xAxis: [{
        type: 'category',
        data: keys,
        axisTick: {
          alignWithLabel: true,
          inside: true
        },
        axisLine: {
          lineStyle: {color: '#666'}
        },
        axisLabel: {
          formatter: function (value: string) {
            return value.substr(5);
          }
        }
      }],
      yAxis: {
        type: 'value',
        show: false
      },
      tooltip: {
        show: true,
        triggerOn: 'click',
        position: 'bottom',
        formatter: '{c}',
        padding: [2, 8, 2, 8],
      },
      series: [
        {
          symbolSize: 12,
          data: values,
          type: 'line',
          symbol: 'circle',
          lineStyle: {
            width: 1,
          },
        }
      ]
    };
  }

  get pieChartList() {
    const {recordList} = this;
    const timeArray = [];
    const today = new Date();
    const endDay = day(today).subtract(30, 'days').format('YYYY-MM-DD');
    for (let i = 0; i < recordList.length; i++) {
      const time = recordList[i].createAt;
      if (day(time).isAfter(endDay)) {
        timeArray.push({
          amount: recordList[i].amount,
          createAt: recordList[i].createAt,
          notes: recordList[i].notes,
          tags: recordList[i].tags,
          type: recordList[i].type
        });
      }
    }
    const newList = clone(timeArray)
        .filter(r => r.type === this.type)
        .sort(function (a, b) {
          if (a.tags[0].id < b.tags[0].id) {
            return -1;
          }
          if (a.tags > b.tags) {
            return 1;
          }
          return 0;
        });
    if (newList.length === 0) {return [];}
    type Result = { title: Tag, total?: number, items: RecordItem[] }[]
    const result: Result = [{
      title: (newList[0].tags)[0],
      items: [newList[0]]
    }];
    for (let i = 1; i < newList.length; i++) {
      const current = newList[i];
      const last = result[result.length - 1];
      if (last.title.id === (current.tags)[0].id) {
        last.items.push(current);
      } else {
        result.push({
          title: (current.tags)[0],
          items: [current]
        });
      }
    }
    result.map(tagGroup => {
      tagGroup.total = tagGroup.items.reduce((sum, item) => sum + item.amount, 0);
    });
    return result;

  }

  get tagChartOptions() {
    const dataList = this.pieChartList;
    const array2 = [];
    for (let i = 0; i < dataList.length; i++) {
      array2.push({
        value: dataList[i].total, name: dataList[i].title.name
      });
    }

    return {
      title: {
        subtext: '仅显示近30天数据',
        left: 'center',
        bottom: 20,
        subtextStyle: {
          color: 'rgb(199,199,199)'
        }
      },
      grid: {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
      },
      tooltip: {
        trigger: 'item',
        formatter: '{c}'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: array2 ,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
          },
          label: {
            normal: {
              show: true,
              formatter: '{b}: {d}%' //自定义显示格式(b:name, c:value, d:百分比)
            }
          },
        }
      ]
    };
  }

  get recordList() {
    return (this.$store.state as RootState).recordList;
  }

  get groupedList() {
    const {recordList} = this;
    return createdAtList(recordList, this.type);
  }

  get currentTag() {
    return this.$store.state.currentTag;
  }

  beforeCreate() {
    this.$store.commit('fetchRecords');
  }

  type = '-';
  interval = 'day';
  recordTypeList = recordTypeList;
};
</script>

<style scoped lang="scss">
.money-chart{
  width: 430%;
  height: 260px;
  background: white;

  &-wrapper {
    overflow: auto;
  }
}
.tag-chart {
  height: 280px;
  background: white;
}
.tabs {
  background: white;
  border-bottom: 1px solid #e3e2e2;
}
::v-deep {
  .type-tabs-item {
    color: black;
    &.selected {
      color: #1e61e3;
      &::after {
        display: none;
      }
    }
  }
}
.selected {
  padding-left: 10px;
  border-left: 6px solid #3e78ee;
  background: #f0f3f5;
}
.noResult {
  padding: 130px  30px;
  text-align: center;
  background: white;
}
</style>

