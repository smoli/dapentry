<template>
  <section class="drawable-steplist-container">
    <h2>{{ $t("ui.stepEditor") }}</h2>

    <div v-for="(line, index) of annotatedCode" v-bind:data-step="index"
         class="drawable-steplist-step" :class="{ selected: line.selected }"
         @click="onStepClicked">{{ line.text }}
    </div>

  </section>
</template>

<script lang="ts">
import {Parser, Token, TokenTypes} from "../../runtime/interpreter/Parser";
import {AppController} from "../../core/AppController";
import {AnnotatedCodeLine} from "../../runtime/CodeManager";
import {UNREACHABLE} from "../../core/Assertions";


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


function constructText(tokens, $t): string {
  const firstToken = tokens[0];

  if (!firstToken) {
    console.log("NO FIRST TOKEN", tokens || null)
    return "NO FIRST TOKEN!";
  }

  const tokenTexts = tokens.map((t: Token) => {
    switch (t.type) {
      case TokenTypes.NUMBER:
        return ( t.value as number ).toFixed(2);

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
  inject: ["controller"],

  computed: {
    annotatedCode(): Array<AnnotatedCodeLine> {

      const selection = this.$store.state.code.selectedLines;

      return this.$store.getters['code/annotated'].map(anno => {
        const tokens = Parser.parseLine(anno.code);
        return {
          ...anno,
          text: constructText(tokens, this.$t),
          selected: selection.indexOf(anno.originalLine) !== -1
        }
      });
    }
  },

  methods: {
    onStepClicked(event) {
      const stepDiv = event.target;
      const index = Number(stepDiv.getAttribute("data-step"));
      const step = this.annotatedCode[index];

      if (!step) {
        UNREACHABLE();
      }

      if (step.selected) {
        ( this.controller as AppController ).clearStatementSelection();
      } else {
        ( this.controller as AppController ).selectStatement(this.annotatedCode[index].originalLine)
      }

    }
  }

}
</script>

<style scoped>

</style>