<template>
  <section class="drawable-data-editor">
    <h2>{{ $t("ui.dataEditor") }}</h2>
    <div v-for="field in fieldEditors">
      <component :is="field.type" :field="field.field" />
    </div>
    <button>+</button>
  </section>
</template>

<script lang="ts">


import {DataField} from "../../state/modules/Data";
import {UNREACHABLE} from "../../core/Assertions";
import NumberEditor from "./NumberEditor";
import ListEditor from "./ListEditor";

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
  computed: {
    fieldEditors() {
      return createFields(this.$store.state.data.fields);
    }
  }
}
</script>

