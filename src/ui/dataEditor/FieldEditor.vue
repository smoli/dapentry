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
      <button class="drawable-data-field-add-value">+</button>
    </td>
  </tr>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";

export default {
  name: "FieldEditor",
  props: ["field"],
  components: { GrowingInput },
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
    }
  }
}
</script>
