<template>
  <Layout>
    <Tabs class="tabs" class-prefix="type"
          :data-source="recordTypeList" :value.sync="type"/>
    <ol v-if="groupedList.length>0">
      <li v-for="(group,index) in groupedList" :key="index">
        <h3 class="title">{{ beautify(group.title) }} <span>￥{{ group.total }}</span></h3>
        <ol>
          <li v-for="item in group.items" :key="item.id"
              class="record">
            <span>{{ tagString(item.tags) }}</span>
            <span class="notes">{{ item.notes }}</span>
            <span>￥{{ item.amount }} </span>
          </li>
        </ol>
      </li>
    </ol>
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
import dayjs from 'dayjs';
import day from 'dayjs';
import createdAtList from '@/lib/createdAtList';


@Component({
  name: 'HelloWorld',
  components: {Tabs},
})
export default class Statistics extends Vue {
  tagString(tags: Tag[]) {
    return tags.length === 0 ? '无' : tags.map(t => t.name).join('，');
  }
  beautify(string: string) {
    const day = dayjs(string);
    const now = dayjs();
    if (day.isSame(now, 'day')) {
      return '今天';
    } else if (day.isSame(now.subtract(1, 'day'), 'day')) {
      return '昨天';
    } else if (day.isSame(now.subtract(2, 'day'), 'day')) {
      return '前天';
    } else if (day.isSame(now, 'year')) {
      return day.format('M月D日');
    } else {
      return day.format('YYYY年M月D日');
    }
  }

  get recordList() {
    return (this.$store.state as RootState).recordList;
  }

  get groupedList() {
    const {recordList} = this;
    return createdAtList(recordList, this.type);
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
.noResult {
  padding: 16px;
  text-align: center;
}
.tabs{
  background: white;
  border-bottom: 1px solid #e3e2e2;
}
::v-deep {
  .type-tabs-item {
    color: #333333;
    background: white;
    &.selected {
      color: #3e78ee;
      &::after {
        display: none;
      }
    }
  }
  .interval-tabs-item {
    height: 48px;
  }
}
%item {
  padding: 8px 16px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.title {
  @extend %item;
  border-left: 6px solid #3e78ee;
  background: #f0f3f5;
}
.record {
  @extend %item;
  background: white;
  border-top:1px solid #eeeeee;
}
.notes {
  margin-right: auto;
  margin-left: 16px;
  color: #999;
}
</style>


