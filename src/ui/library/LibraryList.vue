<template>
  <span v-for="entry in entries">{{ entry.name }}</span>
</template>

<script lang="ts">
export default {
  name: "LibraryList",
  inject: ["controller"],

  computed: {
    entries() {
      return this.$store.state.library.entries;
    }
  }
}
</script>
