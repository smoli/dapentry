<template>
  <section class="drawable-data-editor">
    <h2 v-if="!hideCaption">{{ $t("ui.dataEditor") }}</h2>
    <!--    <button v-if="!hideCaption" @click="onMaximize">Maxi</button>-->
    <table class="drawable-data-field-list">
      <component v-for="field in fieldEditors" :is="field.type" :field="field.field"/>
    </table>
    <button @click="onNewDataField" class="drawable-ui-transparent">+</button>
  </section>
</template>

<script lang="ts">


import {DataField, DataFieldType} from "../../state/modules/Data";
import NumberEditor from "./NumberEditor.vue";
import TableEditor from "./TableEditor.vue";
import ListEditor from "./ListEditor.vue";

interface FieldEditor {
  type: string,
  field: DataField
}

function createFields(fields: Array<DataField>): Array<FieldEditor> {

  return fields.map(field => {

    switch (field.type) {
      case DataFieldType.Number:
      case DataFieldType.String:
        return { type: "NumberEditor", field }

      case DataFieldType.List:
        return { type: "ListEditor", field }
      case DataFieldType.Table:
        return { type: "TableEditor", field }
    }
  });
}


export default {
  name: "DataEditor",
  components: { NumberEditor, ListEditor, TableEditor },
  props: ["hideCaption"],
  inject: ["controller"],

  computed: {
    fieldEditors() {
      return createFields(this.$store.state.data.fields);
    }
  },

  methods: {
    onNewDataField() {
      this.controller.addNewDataField(4);
    },

    async onMaximize() {
      const de = this.controller.modalFactory.createDataEditorModal();
      await de.show();
    }
  }
}
</script>

