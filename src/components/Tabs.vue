<template>
  <ul class="tabs" :class="{[classPrefix+'-tab']:classPrefix}">
    <li v-for="item in dataSource" :key="item.value"
        class="tabs-item"
        :class="liClass(item)"
        @click="select(item)">{{ item.text }}
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

type DataSourceItem = { text: string, value: string }

@Component
export default class Tabs extends Vue {
  @Prop({required: true, type: Array})
  dataSource!: DataSourceItem[];
  @Prop(String) readonly value!: string;
  @Prop(String) classPrefix?: string;

  liClass(item: DataSourceItem){
    return {
      [this.classPrefix + '-tabs-item']: this.classPrefix,
      selected: item.value === this.value
    };
  };


  select(item: DataSourceItem) {
    this.$emit('update:value', item.value);
  }

}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/helper.scss";
ul{
  padding: 0 110px;
}
.tabs {
  background: white;
  display: flex;
  //text-align: center;
  font-size: 20px;

  &-item {
    width: 50%;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &.selected{
      color: $color-highlight;
    }
    &.selected::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: $color-highlight;
    }
  }
}
</style>