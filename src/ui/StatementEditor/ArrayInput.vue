<template>
  <span class="drawable-array-input">

  <button class="drawable-array-input-iterator" v-if="itemCount > 1" @click="prevIndex">&lt;</button>
  <component :is="displayedSegment.type"
             :content="displayedSegment" @change="onChange" ></component>
  <button class="drawable-array-input-iterator" v-if="itemCount > 1"  @click="nextIndex">&gt;</button>
  <span class="drawable-array-input-index">{{displayedIndex}}/{{itemCount}}</span>
  </span>
</template>

<script lang="ts">
import NumberInput from "./NumberInput.vue";
import {createSegmentInfoForToken} from "./createSegments";
import AtRegisterInput from "./AtRegisterInput.vue";
import PointInput from "./PointInput.vue";
import SimpleInput from "./SimpleInput.vue";
import ExpressionInput from "./ExpressionInput.vue";
import Static from "./Static.vue";

export default {
  name: "ArrayInput",
  components: { AtRegisterInput, PointInput, NumberInput, SimpleInput, ExpressionInput, Static },
  props: ["content"],
  inject: ["controller"],

  data() {
    return {
      displayedIndex: 0
    }
  },

  computed: {
    displayedSegment() {
        return createSegmentInfoForToken(
            this.content.token.value[this.displayedIndex],
            this.content.statementIndex,
            [...this.content.subIndexes, this.displayedIndex])
    },
    itemCount() {
      if (!this.content) {
        return 0;
      }
      return this.content.token.value.length;
    }
  },

  methods: {
    prevIndex() {
      if (this.displayedIndex > 0) {
        this.displayedIndex -= 1;
      }
    },

    nextIndex() {
      if (this.displayedIndex < this.content.token.value.length - 1) {
        this.displayedIndex += 1;
      }
    }
  }
}
</script>
