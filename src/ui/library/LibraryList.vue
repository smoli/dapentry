<template>
  <section class="drawable-library-container">

    <h2>Library
      <button @click="onSave"
              v-if="$store.state.auth.authenticated"
              class="drawable-ui-transparent">
        Save current
      </button>
    </h2>
    <div v-if="$store.state.auth.authenticated">
      <ul class="drawable-library-entry-list">
        <li v-for="entry in entries">
          <button class="drawable-library-preview" @click="onInsertEntry(entry)">
            <Preview :svg-code="entry.svgPreview"
                     :vb-width="entry.previewVBWidth"
                     :vb-height="entry.previewVBHeight"
                     width="40px"
                     height="40px"/>
          </button>
          <div class="drawable-library-entry-info">
            <h3>{{ entry.name }}</h3>
            <p>{{ entry.description}}</p>
            <button>Edit</button>
          </div>
        </li>
      </ul>
    </div>
    <span v-else>
    <button @click="onLogin">Login to view library</button>
  </span>
  </section>
</template>

<script lang="ts">
import {LibraryEntry} from "../../core/Library";
import Preview from "../drawing/Preview";

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
