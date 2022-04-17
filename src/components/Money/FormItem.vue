<template>
  <div>
    <label class="formItem">
      <span class="name">{{ this.fieldName }}</span>
      <template v-if="type === 'date'">
        <input :type="type || 'text'"
               :value="x(value)"
               @input="onValueChanged($event.target.value)"
               :placeholder="placeholder">
      </template>
      <template v-else>
        <input :type="type || 'text'"
               :value="value"
               @input="onValueChanged($event.target.value)"
               :placeholder="placeholder">
      </template>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import dayjs from 'dayjs';

@Component
export default class FormItem extends Vue {
  @Prop({default: ''}) readonly value!: string;
  @Prop({required: true}) fieldName!: string;
  @Prop() placeholder?: string;
  @Prop() type?: string;


  onValueChanged(value: string) {
    this.$emit('update:value', value);
  }
  x(isoString:string){
    return dayjs(isoString).format('YYYY-MM-DD')
  }
};
</script>

<style lang="scss" scoped>
.formItem {
  font-size: 14px;
  display: flex;
  align-items: center;
  padding-right: 10px;

  .name {
    padding-left:10px ;
    width: 60px;
  }

  input {
    border: none;
    height: 44px;
    flex-grow: 1;
    background: transparent;
  }
}
</style>