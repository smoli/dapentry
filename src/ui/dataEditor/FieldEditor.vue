<template>
  <tr>
    <td>
      <button>-</button>
    </td>
    <td>
      <span class="drawable-data-field-name" v-if="editingFieldName === false" @dblclick="onEditFieldName">{{ field.name }}</span>
      =
      <GrowingInput autofocus="true" @onblur="onFieldNameBlur" v-if="editingFieldName === true"
                    class="drawable-data-field-name" :value="field.name"/>
    </td>
    <td>
      <slot></slot>
      <button class="drawable-data-field-add-value" @click="onAddValue">+</button>
    </td>
  </tr>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";

export default {
  name: "FieldEditor",
  props: ["field"],
  components: { GrowingInput },
  inject: ["controller"],

  data() {
    return {
      editingFieldName: false
    }
  },

  methods: {
    onEditFieldName() {
      this.editingFieldName = true;
    },
    onFieldNameBlur() {
      this.editingFieldName = false;
    },

    onAddValue(event) {
      this.controller.addValueToDataField(this.field.name, 4);
    }
  }
}
</script>
