<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import type { Field, FieldType } from '@/types'
import { useBlueprintStore } from '@/stores/blueprints'
import FieldCard from './FieldCard.vue'
import AddFieldMenu from './AddFieldMenu.vue'
import Icon from '@/components/ui/Icon.vue'

const store = useBlueprintStore()

// Two-way binding for vuedraggable; writes the reordered list back to the store.
const fields = computed<Field[]>({
  get: () => store.activeFields,
  set: (value) => store.setActiveFields(value),
})

const breadcrumb = computed(() => store.breadcrumb)

function addField(type: FieldType) {
  store.addField(type)
}
</script>

<template>
  <section>
    <!-- Repeater breadcrumb -->
    <div v-if="breadcrumb.length" class="mb-3 flex items-center gap-1.5 text-[12px]">
      <button
        class="text-content-secondary hover:text-content-primary transition-colors"
        @click="store.gotoDepth(0)"
      >
        Fields
      </button>
      <template v-for="(crumb, i) in breadcrumb" :key="crumb.id">
        <Icon name="chevron-right" :size="12" class="text-content-muted" />
        <button
          class="transition-colors"
          :class="i === breadcrumb.length - 1 ? 'text-accent font-medium' : 'text-content-secondary hover:text-content-primary'"
          @click="store.gotoDepth(i + 1)"
        >
          {{ crumb.label || crumb.handle }}
        </button>
      </template>
    </div>

    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-[13px] font-semibold text-content-primary">
        {{ breadcrumb.length ? 'Nested fields' : 'Fields' }}
        <span class="ml-1.5 text-content-muted">{{ fields.length }}</span>
      </h2>
      <AddFieldMenu @add="addField" />
    </div>

    <draggable
      v-model="fields"
      item-key="id"
      handle=".drag-handle"
      :animation="180"
      ghost-class="drag-ghost"
      class="space-y-2"
    >
      <template #item="{ element }">
        <FieldCard :field="element" />
      </template>
    </draggable>

    <!-- Empty state -->
    <div
      v-if="!fields.length"
      class="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-content-muted"
    >
      <Icon name="layers" :size="22" />
      <span class="text-[13px]">No fields yet — use “Add Field” to start.</span>
    </div>
  </section>
</template>

<style scoped>
:deep(.drag-ghost) {
  opacity: 0.5;
}
</style>
