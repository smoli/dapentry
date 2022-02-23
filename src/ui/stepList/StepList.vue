<template>
  <section class="drawable-steplist-container">
    <h2 @click="toggleDisplay">{{ $t("ui.stepEditor") }}
      <button @click="onLoopSelection"
              :disabled="noLinesSelected"
              class="drawable-ui-transparent"
      >Loop
      </button>
    </h2>

    <div v-if="!showCode">
      <div v-for="(line, index) of annotatedCode" v-bind:data-step="index"
           class="drawable-steplist-step" :class="{ selected: line.selected }"
           :style="{ 'margin-left': line.level + 'em' }"
           @click="onStepClicked">{{ line.text }}
        <button @click="onDeleteStep(line, $event)"
                class="drawable-steplist-step-delete drawable-ui-transparent">
          x
        </button>
        <i :title="$t('ui.stepList.pauseExplanation')" v-if="line.originalLine === lastSelectedLine"
           class="drawable-steplist-step-pause fa-solid fa-circle-pause"></i>
      </div>
    </div>
    <div v-if="showCode">
      <textarea rows="35" cols="37" style="font-family: monospace; font-size: 10pt" disabled="disable">{{ code }}</textarea>
    </div>

  </section>
</template>

<script lang="ts">
import {Parser, Token, TokenTypes} from "../../runtime/interpreter/Parser";
import {AppController} from "../../core/AppController";
import {AnnotatedCodeLine} from "../../runtime/CodeManager";
import {ASSERT, UNREACHABLE} from "../../core/Assertions";
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

      case TokenTypes.ARRAY:
        return `${( t.value as Array<Token> ).length} ${$t("ui.points")}`

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
      selectedFirst: null,
      showCode: false
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

    noLinesSelected(): boolean {
      return this.$store.state.code.selectedLines.length === 0;
    },

    code():string {
        return this.$store.state.code.code.join("\n");
    }
  },

  methods: {
    onStepClicked(event: MouseEvent) {
      const code = this.annotatedCode;
      const stepDiv: HTMLElement = event.target as HTMLElement;
      const index = Number(stepDiv.getAttribute("data-step"));
      const step = code[index];

      ASSERT(!!step, "There is no step!")

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

    async onLoopSelection(event) {
      if (!this.$store.state.code.selectedLines.length) {
        return;
      }
      event.stopPropagation();
      await this.controller.loopStatements(this.$store.state.code.selectedLines)
      await this.controller.clearStatementSelection();
    },

    async onDeleteStep(step: AnnotatedCodeLine, event: Event) {
      event.stopPropagation();
      await this.controller.deleteStatements(step.originalLine);
    },

    toggleDisplay() {
      if (window.location.hostname !== "localhost") {
        return;
      }
      this.showCode = !this.showCode;
    }
  }

}
</script>

<style scoped>

</style>
