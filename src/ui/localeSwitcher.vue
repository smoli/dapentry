<template>
  <div class="locale-switcher">
    <label>{{ $t("ui.language") }}{{ availableLocales }}</label>
    <select @change="onLocaleSelected">
<!--      <option :key="`locale-${currentLocale}`" :value="currentLocale" selected="selected" disabled="disabled">{{ $t(`languages.${currentLocale}`) }}</option>-->
      <option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale" >{{ $t(`languages.${locale}`) }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "localeSwitcher",
  inject: ["controller"],

  computed: {
    currentLocale() {
      return this.$i18n.locale;
    },

    availableLocales() {
      return this.$i18n.availableLocales//.filter(l => this.$t(`languages.${l}`) !== this.$t(`languages.${this.$i18n.locale}`));
    }
  },

  methods: {
    onLocaleSelected(event) {
      const sel = event.target;
      if (sel.selectedOptions) {
        const value = sel.selectedOptions[0].value;
        this.controller.setLocale(value);
      }
    }
  }


}
</script>

<style scoped>

</style>