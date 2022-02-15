<template>
  <section class="drawable-steplist-container">
    <h2>{{ $t("ui.stepEditor") }}
      <button @click="onLoopSelection"
              :disabled="noLinesSelected"
              class="drawable-ui-transparent"
      >Loop</button>
    </h2>

    <div v-for="(line, index) of annotatedCode" v-bind:data-step="index"
         class="drawable-steplist-step" :class="{ selected: line.selected }"
         :style="{ 'margin-left': line.level + 'em' }"
         @click="onStepClicked">{{ line.text }}
      <i :title="$t('ui.stepList.pauseExplanation')" v-if="line.originalLine === lastSelectedLine"
         class="drawable-steplist-step-pause fa-solid fa-circle-pause"></i>
    </div>

  </section>
</template>

<script lang="ts">
import {Parser, Token, TokenTypes} from "../../runtime/interpreter/Parser";
import {AppController} from "../../core/AppController";
import {AnnotatedCodeLine} from "../../runtime/CodeManager";
import {UNREACHABLE} from "../../core/Assertions";
import {rangeSelect} from "../core/rangeSelect";
import {getTextIdForTokens} from "../core/GetTextIdForTokens";


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

  data() {
    return {
      selectedFirst: null
    }
  },

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
    },

    lastSelectedLine(): number {
      return Math.max(...this.$store.state.code.selectedLines);
    },

    noLinesSelected():boolean {
      return this.$store.state.code.selectedLines.length === 0;
    }
  },

  methods: {
    onStepClicked(event: MouseEvent) {
      const code = this.annotatedCode;
      const stepDiv: HTMLElement = event.target as HTMLElement;
      const index = Number(stepDiv.getAttribute("data-step"));
      const step = code[index];

      if (!step) {
        UNREACHABLE();
      }

      if (event.shiftKey) {
        const selSteps = rangeSelect(
            code.map(c => c.originalLine),
            this.$store.state.code.selectedLines,
            step.originalLine,
            this.selectedFirst);

        ( this.controller as AppController ).selectStatements(selSteps)
      } else {
        if (step.selected && this.$store.state.code.selectedLines.length === 1) {
          ( this.controller as AppController ).clearStatementSelection();
          this.selectedFirst = null;
        } else {
          ( this.controller as AppController ).selectStatement(this.annotatedCode[index].originalLine)
          this.selectedFirst = this.annotatedCode[index].originalLine;
        }
      }
    },

    async onLoopSelection() {
      if (!this.$store.state.code.selectedLines.length) {
        return;
      }
      await this.controller.loopStatements(this.$store.state.code.selectedLines)
      await this.controller.clearStatementSelection();
    }
  }

}
</script>

<style scoped>

</style>
