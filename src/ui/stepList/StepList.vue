<template>
  <section class="drawable-steplist-container">
    <h2>{{ $t("ui.stepEditor") }}</h2>
    <div v-for="line of annotatedCode">{{ line.code }}</div>
  </section>
</template>

<script>
export default {
  name: "StepList",

  computed: {
    annotatedCode() {
      return this.$store.getters['code/annotated'];
    }
  }

}
</script>

<style scoped>

</style>