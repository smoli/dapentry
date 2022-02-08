<template>
  <div class="locale-switcher">
    <label>{{ $t("ui.language") }}</label>
    <select v-model="$i18n.locale">
      <option :key="`locale-${currentLocale}`" :value="currentLocale" selected="selected" disabled="disabled">{{ $t(`languages.${currentLocale}`) }}</option>
      <option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale" >{{ $t(`languages.${locale}`) }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "localeSwitcher",

  computed: {
    currentLocale() {
      return this.$i18n.locale;
    },

    availableLocales() {
      return this.$i18n.availableLocales.filter(l => this.$t(`languages.${l}`) !== this.$t(`languages.${this.$i18n.locale}`));
    }
  }


}
</script>

<style scoped>

</style>