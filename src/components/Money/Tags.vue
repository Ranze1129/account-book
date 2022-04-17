<template>
  <div class="tags">
    <router-link to="/labels" class="new">
      <Icon name="set"/>
      <button>自定义标签</button>
    </router-link>
    <ul class="current">
      <li v-for="tag in tagList" :key="tag.id"
          :class="{selected: selectedTags.indexOf(tag)>=0 }"
          @click="toggle(tag)">{{ tag.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {TagHelper} from '@/mixins/TagHelper';

@Component
export default class Tags extends mixins(TagHelper) {
  selectedTags: string[] = [];

  get tagList() {
    return this.$store.state.tagList;
  }
  created() {
    this.$store.commit('fetchTags');
  }

  toggle(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }else if(this.selectedTags.length>0){
      this.selectedTags = []
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.$emit('update:value', this.selectedTags);
  }

}
</script>

<style lang="scss" scoped>
.tags {
  font-size: 14px;
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column-reverse;
  background: white ;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 1;
  overflow: auto;

  > .current {
    display: flex;
    flex-wrap: wrap;

    > li {
      $bg: #d9d9d9;
      background: $bg;
      $h: 41px;
      height: $h;
      line-height: 30px;
      border-radius: 30px;
      padding: 5px 16px;
      margin-right: 12px;
      margin-top: 10px;
      //text-align: center;
      &.selected{
        background:#1e61e3;
        color: white;
      }
    }
  }

  > .new {
    border-radius: 30px;
    padding: 5px 16px;
    border: 1px solid #3e78ee;

    button {
      background: transparent;
      border: none;
      color: #3e78ee;
      padding: 0 4px;
    }
    svg{
      color: #3e78ee;
    }
  }
}
</style>