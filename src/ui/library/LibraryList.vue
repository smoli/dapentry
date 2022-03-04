<template>
  <span v-if="$store.state.auth.authenticated">
    <button @click="onSave">Save current</button>
    <button class="drawable-library-preview" v-for="entry in entries" @click="onInsertEntry(entry)">
      <Preview :svg-code="entry.svgPreview"
               :vb-width="entry.previewVBWidth"
               :vb-height="entry.previewVBHeight"
               width="40px"
               height="40px"/>
      <div>{{ entry.name }}</div>
      </button>
  </span>
  <span v-else>
    <button @click="onLogin">Login to view library</button>
  </span>
</template>

<script lang="ts">
import {LibraryEntry} from "../../core/Library";
import Preview from "../drawing/Preview.vue";

export default {
  name: "LibraryList",
  components: { Preview },
  inject: ["controller"],

  computed: {
    entries() {
      return this.$store.state.library.entries;
    },
  },

  methods: {
    onInsertEntry(entry: LibraryEntry) {
      this.controller.switchToInsertLibraryEntryTool(entry);
    },

    onSave() {
      this.controller.saveDrawingToLibrary();
    },

    onLogin() {
      this.controller.login();
    }
  }
}
</script>
