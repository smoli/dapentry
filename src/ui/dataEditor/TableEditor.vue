<template>
  <FieldEditor :field="field">
    <table class="drawable-data-table-value">
      <thead>
      <tr>
        <th></th>
        <th v-for="c of indexes">{{ c }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="c of columnNames">
        <th>{{c}}:</th>
        <td v-for="(row, index) of field.value">
          <GrowingInput :value="row[c]" @change="onValueChanged(index, c, $event)"/>
        </td>
      </tr>
      </tbody>
    </table>
  </FieldEditor>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";
import FieldEditor from "./FieldEditor.vue";

export default {
  name: "ListEditor",
  components: { FieldEditor, GrowingInput },
  props: ["field"],
  inject: ["controller"],

  computed: {
    columnNames() {
      return Object.keys(this.field.value[0]);
    },

    indexes() {
      return new Array(this.field.value.length).fill(1).map((a,i) => i + 1);
    }
  },

  methods: {
    onValueChanged(index, column, event) {
      this.controller.setDataTableCellValue(this.field.name, index, column, event.target.value);
    }
  }
}
</script>
