<template>
  <span v-if="$store.state.auth.authenticated">
    <span>Welcome, {{ $store.state.auth.user.email }}!</span>
    <span v-if="!$store.state.auth.user.verified">Unverified</span>
    <button @click="onSave">Save current</button>
    <button v-for="entry in entries" @click="onInsertEntry(entry)">{{ entry.name }}</button>
  </span>
  <span v-else>
    <button @click="onLogin">Login to view library</button>
  </span>
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
