<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlueprintStore } from '@/stores/blueprints'
import AppShell from '@/components/layout/AppShell.vue'

const store = useBlueprintStore()

onMounted(() => {
  // Open the first blueprint so the editor isn't empty on launch.
  if (!store.selectedBlueprintId && store.blueprints.length) {
    store.selectBlueprint(store.blueprints[0].id)
  }
})
</script>

<template>
  <AppShell />
</template>
