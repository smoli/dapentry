<template>
  <section class="drawable-data-editor">
    <h2 v-if="!hideCaption">{{ $t("ui.dataEditor") }}</h2>
    <button v-if="!hideCaption" @click="onMaximize">Maxi</button>
    <table class="drawable-data-field-list">
      <component v-for="field in fieldEditors" :is="field.type" :field="field.field" />
    </table>
    <button @click="onNewDataField" class="drawable-ui-transparent">+</button>
  </section>
</template>

<script lang="ts">


import {DataField} from "../../state/modules/Data";
import {UNREACHABLE} from "../../core/Assertions";
import NumberEditor from "./NumberEditor.vue";
import ListEditor from "./ListEditor.vue";

interface FieldEditor {
  type: string,
  field: DataField
}

function createFields(fields: Array<DataField>):Array<FieldEditor> {

  return fields.map(field => {
      if (Array.isArray(field.value)) {

        if (field.value.length) {
          if (Array.isArray(field.value[0])) {
            return { type: "TableEditor", field }
          }
        }

        return { type: "ListEditor", field}
      }

      if (typeof field.value === "number") {
        return { type: "NumberEditor", field }
      }

      UNREACHABLE(`Unsupported field value ${field.value} on ${field.name}`);
  });
}


export default {
  name: "DataEditor",
  components: { NumberEditor, ListEditor },
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

