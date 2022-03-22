<template>
  <tr @drop="onFileDrop" @dragover="onFileDragOver" @dragleave="onFileDragLeave" :class="{ 'file-drag': fileDrag }">
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
      <button class="drawable-data-field-add-value drawable-ui-transparent" @click="onAddValue" title="Add a value">+</button>
      <button class="drawable-ui-transparent drawable-data-field-add-column" @click="onAddColumn" title="Add a column">↩</button>
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
      editingFieldName: false,
      fileDrag: false
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

    onAddColumn(event) {
      this.controller.addColumnToDataField(this.field.name, 4);
    },

    async onRemoveField() {
      this.controller.removeDataField(this.field.name);
    },

    onFieldNameChange(event) {
      this.controller.renameDataField(this.field.name, event.target.value);

    },

    onDragStart: function (event: DragEvent) {

      let type = DnDDataType.Register;
      const info: DnDInfo = {
        value1: this.field.name,
        type: type
      }

      event.dataTransfer.setData(type, serializeDNDInfo(info));

      if (Array.isArray(this.field.value)) {
        info.type = type = DnDDataType.ArrayRegister;
        event.dataTransfer.setData(type, serializeDNDInfo(info));
      }
    },

    onFileDragOver(event) {
      event.preventDefault();
      this.fileDrag = true;
    },

    onFileDragLeave(event) {
      event.preventDefault();
      this.fileDrag = false;
    },

    async onFileDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      this.fileDrag = false;

      if (event.dataTransfer.files.length) {
        if (event.dataTransfer.files.length > 1) {
          const dialog = this.controller.modalFactory.createInfoModal();
          await dialog.show({
            text: "Please use only one file!"
          });

          return;
        }

        const fr = new FileReader();

        fr.onload = (event) => {
          this.controller.loadFieldFromCSV(this.field.name, "" + event.target.result)
        }

        fr.readAsText(event.dataTransfer.files[0]);
      }

    }




  }
}
</script>
