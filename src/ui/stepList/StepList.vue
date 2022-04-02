<template>
  <section ref="scrollContainer" class="drawable-steplist-container">
    <h2 @click="toggleDisplay">{{ $t("ui.stepEditor") }}
      <button @click="onLoopSelection"
              :disabled="noLinesSelected"
              class="drawable-ui-transparent"
      >Loop
      </button>
      <ToggleButton transparent="true" :active="filter" @change="filter = !filter">Filter</ToggleButton>
    </h2>

    <div v-if="!showCode">
      <div ref="steps" v-for="(line, index) of annotatedCode" v-bind:data-step="index"
           class="drawable-steplist-step"
           :class="{ selected: line.selected, filteredOut: line.filteredOut}"
           :style="{ 'margin-left': line.level + 'em' }"
           @click="onStepClicked(line, $event)">
<!--        <button v-if="line.blockBegin">&gt;</button>-->
        <span v-if="!line.filteredOut">{{ line.text }}</span>
        <button v-if="!line.filteredOut" @click="onDeleteStep(line, $event)"
                class="drawable-steplist-step-delete drawable-ui-transparent">
          x
        </button>
        <div :title="$t('ui.stepList.pauseExplanation')"
           v-if="line.originalLine === lastSelectedLine && !line.filteredOut"
           class="drawable-steplist-step-pause"></div>
      </div>
    </div>
    <div v-if="showCode">
      <textarea rows="35" cols="37" style="font-family: monospace; font-size: 10pt"
                disabled="disable">{{ code }}</textarea>
    </div>

  </section>
</template>

<script lang="ts">
import {Parser} from "../../runtime/interpreter/Parser";
import {AppController} from "../../core/AppController";
import {AnnotatedCodeLine} from "../../runtime/CodeManager";
import {ASSERT} from "../../core/Assertions";
import {rangeSelect} from "../core/rangeSelect";
import {constructText} from "../core/ConstructText";
import ToggleButton from "../core/ToggleButton.vue";
import {AppConfig} from "../../core/AppConfig";


export default {
  name: "StepList",
  components: { ToggleButton },
  inject: ["controller"],

  data() {
    return {
      selectedFirst: null,
      showCode: false,
      filter: false
    }
  },

  updated() {
    const steps = this.$refs["steps"];
    if (steps?.length) {
      let index = steps.length - 1
      if (this.$store.state.code.selectedLines.length) {
        index = Math.max(...this.$store.state.code.selectedLines)
      }

      if (!steps[index]) return;

      const stepRect = steps[index].getBoundingClientRect();
      const parRect = this.$refs["scrollContainer"].getBoundingClientRect();

      if (stepRect.bottom < parRect.top) {
        steps[index].scrollIntoView(true);
      }
      if (stepRect.top > parRect.bottom) {
        steps[index].scrollIntoView(false);
      }
    }
  },

  computed: {
    annotatedCode(): Array<AnnotatedCodeLine> {

      const selection = this.$store.state.code.selectedLines;
      let visibleIndexes = null;
      if (this.filter) {
        visibleIndexes = this.getLineIndexesForSelectedObjects();
      }

      return this.$store.getters['code/annotated'].map(anno => {
        const tokens = Parser.parseLine(anno.code);
        return {
          ...anno,
          blockBegin: tokens[0].value === AppConfig.Runtime.Opcodes.ForEach || tokens[0].value === AppConfig.Runtime.Opcodes.Do,
          filteredOut: this.filter ? visibleIndexes.indexOf(anno.originalLine) === -1 : false,
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

    code(): string {
      return this.$store.state.code.code.join("\n");
    }
  },

  methods: {
    getLineIndexesForSelectedObjects() {
      let ret = [];
      if (this.filter && this.$store.state.drawing.selection.length) {

        const cm = this.$store.state.code.codeManager;
        for (const o of this.$store.state.drawing.selection) {
          const indexes = cm.getStatementIndexesWithParticipation(o.uniqueName);
          if (indexes) {
            ret.push(...indexes);
          }
        }
      }
      return ret;
    },


    onStepClicked(line, event: MouseEvent) {
      const code = this.annotatedCode;
      // const stepDiv: HTMLElement = event.target as HTMLElement;
      // const index = Number(stepDiv.getAttribute("data-step"));
      const step = line;

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
          ( this.controller as AppController ).selectStatement(step.originalLine)
          this.selectedFirst = step.originalLine;
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
    },

    onClickFilter(event) {
      event.stopPropagation();
      this.filter = !this.filter;
    }
  }

}
</script>

<style scoped>

</style>
