<template>
  <tr>
    <td>
      <button @click="onRemoveField" class="drawable-ui-transparent">-</button>
    </td>
    <td>
      <span class="drawable-data-field-name"
            v-if="editingFieldName === false"
            @dblclick="onEditFieldName"
            draggable="true"
            @dragstart="onDragStart">
        {{ field.name }}
      </span>

      <GrowingInput ref="fieldName" autofocus="true" @onblur="onFieldNameBlur" v-if="editingFieldName === true"
                    class="drawable-data-field-name" :value="field.name" @change="onFieldNameChange"
      />
      =
    </td>
    <td>
      <slot></slot>
      <button class="drawable-data-field-add-value drawable-ui-transparent" @click="onAddValue">+</button>
    </td>
  </tr>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";
import {DnDDataType, DnDInfo, serializeDNDInfo} from "../dnd/DnDInfo";

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
    },

    async onRemoveField() {
      this.controller.removeDataField(this.field.name);
    },

    onFieldNameChange(event) {
      this.controller.renameDataField(this.field.name, event.target.value);
      this.$refs["fieldName"].blur();
    },

    onDragStart(event: DragEvent) {

      const info: DnDInfo = {
        value1: this.field.name,
        type: DnDDataType.Register
      }

      event.dataTransfer.setData(DnDDataType.Register, serializeDNDInfo(info));

    }


  }
}
</script>
