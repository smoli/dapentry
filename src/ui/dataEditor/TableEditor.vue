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
        <th>
          <span v-if="editingColumn !== c"
                draggable="true"
                @dblclick="onEditColumnName(c)"
                @dragstart="onColumnDragStart(c, $event)">{{ c }}:</span>

          <GrowingInput ref="columnName" autofocus="true" @onblur="onColumnNameBlur" v-if="editingColumn === c"
                        class="drawable-data-field-name" :value="c" @change="onColumnNameChange"
          />
        </th>
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
import {DnDDataType, DnDInfo, serializeDNDInfo} from "../dnd/DnDInfo";

export default {
  name: "ListEditor",
  components: { FieldEditor, GrowingInput },
  props: ["field"],
  inject: ["controller"],

  data() {
    return {
      editingColumn: null
    }
  },

  computed: {
    columnNames() {
      return Object.keys(this.field.value[0]);
    },

    indexes() {
      return new Array(this.field.value.length).fill(1).map((a, i) => i + 1);
    }
  },

  methods: {
    onColumnNameBlur() {
      this.editingColumn = null;
    },

    async onColumnNameChange(event) {
        await this.controller.renameTableColumn(this.field.name, this.editingColumn, event.target.value);
    },

    onEditColumnName(name) {
        this.editingColumn = name;
    },

    onValueChanged(index, column, event) {
      this.controller.setDataTableCellValue(this.field.name, index, column, event.target.value);
    },

    onColumnDragStart: function (column: string, event: DragEvent) {

      let type = DnDDataType.Register;
      const info: DnDInfo = {
        value1: this.field.name + "." + column,
        type: type
      }

      event.dataTransfer.setData(type, serializeDNDInfo(info));
    }
  }
}
</script>
