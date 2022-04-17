<template>
  <Layout class-prefix="layout">
    <NumberPad :value.sync="record.amount" @submit="saveRecord"/>
    <div class="formItem">
      <div class="notes">
        <Icon name="notes"/>
        <FormItem field-name="   " placeholder="输入备注..."
                  :value.sync="record.notes"/>
      </div>
      <div class="createAt">
        <FormItem field-name="日期" placeholder="输入日期..."
                  type="date"
                  :value.sync="record.createAt"/>
      </div>
    </div>
    <Tags @update:value="record.tags = $event"/>
    <Tabs class="tabs" :data-source="recordTypeList" :value.sync="record.type"/>
  </Layout>
</template>

<script lang="ts">
import NumberPad from '@/components/Money/NumberPad.vue';
import FormItem from '@/components/Money/FormItem.vue';
import Tags from '@/components/Money/Tags.vue';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import recordTypeList from '@/constants/recordTypeList';
import Tabs from '@/components/Tabs.vue';

@Component({
  components: {Tabs, Tags, FormItem, NumberPad},
})
export default class Money extends Vue {
  get recordList() {
    return this.$store.state.recordList;
  }
  recordTypeList=recordTypeList;

  record: RecordItem = {
    tags: [], notes: '', type: '-', amount: 0, createAt: new Date().toISOString()
  };

  created() {
    this.$store.commit('fetchRecords');
  }

  onUpdateNotes(value: string) {
    this.record.notes = value;
  }

  saveRecord() {
    if (!this.record.tags || this.record.tags.length === 0) {
      return window.alert('请选择标签');
    }
    this.$store.commit('createRecord', this.record);
    if (this.$store.state.createRecordError === null) {
      window.alert('已保存');
      this.record.notes = '';
    }
  }

};
</script>

<style lang="scss" scoped>
.formItem{
  display: flex;
  >.notes {
    position: relative;
    background: #f2f2f2;
    width: 50%;
  }
}
::v-deep .notes{
  .formItem {
    input {
      padding-left: 30px;
    }
  }
}
::v-deep .layout-content {
  display: flex;
  flex-direction: column-reverse;
}
svg {
  position: absolute;
  top: 13px;
  left: 10px;
}
.tabs {
  background: #1e61e3;
}
</style>
