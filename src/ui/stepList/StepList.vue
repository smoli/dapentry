<template>
  <section class="drawable-steplist-container">
    <h2>{{ $t("ui.stepEditor") }}</h2>
    <div class="drawable-steplist-step" v-for="line of annotatedCode">{{ line.text }}</div>
  </section>
</template>

<script lang="ts">
import {Parser, Token, TokenTypes} from "../../runtime/interpreter/Parser";


function getTextIdForTokens(tokens: Array<Token>): string {
  const firstToken = tokens[0];
  switch (firstToken.value) {

    case 'DO':
      if (tokens.length === 2) {
        return "DO_NONE";
      } else if (tokens.length === 3) {
        return "DO_VALUE";
      } else if (tokens.length === 4) {
        return "DO_VALUE_INDEX";
      }
      break;

    case 'MOVE':
      if (tokens.length === 3) {
        if (tokens[2].type === TokenTypes.REGISTERAT) {
          return "MOVE_TO"
        }
      }

  }
  return firstToken.value as string;
}


function constructText(tokens, $t):string {
  const firstToken = tokens[0];

  if (!firstToken) {
    console.log("NO FIRST TOKEN", tokens || null)
    return "NO FIRST TOKEN!";
  }

  const tokenTexts = tokens.map((t: Token) => {
    switch (t.type) {
      case TokenTypes.NUMBER:
        return (t.value as number).toFixed(2);

      case TokenTypes.POINT:
        return `(${t.value[0].value}, ${t.value[1].value})`;

      case TokenTypes.REGISTERAT:
        if (t.value[1].type === TokenTypes.NUMBER) {
          return `${t.value[0].value} at ${t.value[1].value}`;
        } else {
          return `${t.value[0].value}'s ${t.value[1].value}`;
        }

      case TokenTypes.EXPRESSION:
        return Parser.constructCodeLine([t]);

      default:
        return t.value;
    }
  });

  if (firstToken.type === TokenTypes.ANNOTATION) {
    if (firstToken.args) {
      tokenTexts.push(...firstToken.args);
    }
  }

  return $t("statements." + getTextIdForTokens(tokens), tokenTexts);
}




export default {
  name: "StepList",

  computed: {
    annotatedCode() {
      return this.$store.getters['code/annotated'].map(anno => {
        const tokens = Parser.parseLine(anno.code);
        return {
          ...anno,
          text: constructText(tokens, this.$t)
        }
      });
    }
  }

}
</script>

<style scoped>

</style>