<template>
  <button v-for="entry in entries" @click="onInsertEntry(entry)">{{ entry.name }}</button>
</template>

<script lang="ts">
import {LibraryEntry} from "../../core/Library";

export default {
  name: "LibraryList",
  inject: ["controller"],

  computed: {
    entries() {
      return this.$store.state.library.entries;
    },
  },

  methods: {
    onInsertEntry(entry: LibraryEntry) {
      this.controller.switchToInsertLibraryEntryTool(entry);
    }
  }
}
</script>
