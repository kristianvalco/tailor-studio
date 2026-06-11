<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BlueprintType } from '@/types'
import { useBlueprintStore } from '@/stores/blueprints'
import BlueprintTreeItem from './BlueprintTreeItem.vue'
import NewBlueprintButton from './NewBlueprintButton.vue'
import ProjectSwitcher from './ProjectSwitcher.vue'
import Icon from '@/components/ui/Icon.vue'

const store = useBlueprintStore()
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return store.blueprints.filter(
    (b) => !q || b.name.toLowerCase().includes(q) || b.handle.toLowerCase().includes(q),
  )
})

const collections = computed(() => filtered.value.filter((b) => b.type !== 'global'))
const globals = computed(() => filtered.value.filter((b) => b.type === 'global'))

function create(type: BlueprintType) {
  store.addBlueprint(type)
}
</script>

<template>
  <aside class="flex h-full w-64 flex-col border-r border-border-subtle bg-surface-1">
    <!-- Brand (drag handle; top padding clears the macOS traffic lights) -->
    <div data-tauri-drag-region class="flex items-center gap-2.5 px-4 pb-3 pt-9">
      <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white">
        <Icon name="layers" :size="16" />
      </div>
      <div>
        <div class="text-[13px] font-semibold leading-tight text-content-primary">Tailor Studio</div>
        <div class="text-[10px] text-content-muted">Blueprint builder</div>
      </div>
    </div>

    <!-- Project switcher -->
    <div class="px-3 pb-2">
      <ProjectSwitcher />
    </div>

    <!-- Search -->
    <div class="px-3 pb-2">
      <div class="flex items-center gap-2 rounded-lg bg-surface-3 px-2.5">
        <Icon name="search" :size="14" class="text-content-muted" />
        <input
          v-model="query"
          placeholder="Search blueprints…"
          class="h-8 w-full bg-transparent text-[12px] text-content-primary placeholder:text-content-muted focus:outline-none"
        />
      </div>
    </div>

    <!-- Tree -->
    <nav class="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
      <div class="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-content-muted">
        Collections
      </div>
      <BlueprintTreeItem
        v-for="bp in collections"
        :key="bp.id"
        :blueprint="bp"
        :active="bp.id === store.selectedBlueprintId"
        @select="store.selectBlueprint(bp.id)"
        @delete="store.deleteBlueprint(bp.id)"
      />
      <p v-if="!collections.length" class="px-2 py-3 text-[12px] text-content-muted">No collections.</p>

      <template v-if="globals.length">
        <div class="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-content-muted">
          Global Settings
        </div>
        <BlueprintTreeItem
          v-for="bp in globals"
          :key="bp.id"
          :blueprint="bp"
          :active="bp.id === store.selectedBlueprintId"
          @select="store.selectBlueprint(bp.id)"
          @delete="store.deleteBlueprint(bp.id)"
        />
      </template>
    </nav>

    <!-- New blueprint -->
    <div class="border-t border-border-subtle p-3">
      <NewBlueprintButton @create="create" />
    </div>
  </aside>
</template>
