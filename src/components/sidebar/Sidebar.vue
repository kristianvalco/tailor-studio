<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlueprintType } from '@/types'
import { useBlueprintStore } from '@/stores/blueprints'
import { useUiStore } from '@/stores/ui'
import BlueprintTreeItem from './BlueprintTreeItem.vue'
import NewBlueprintButton from './NewBlueprintButton.vue'
import ProjectSwitcher from './ProjectSwitcher.vue'
import Icon from '@/components/ui/Icon.vue'

const store = useBlueprintStore()
const ui = useUiStore()
const { t } = useI18n()
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
  // On the single-pane mobile layout, jump straight into the new blueprint.
  ui.setMobileView('editor')
}

function selectBlueprint(id: string) {
  store.selectBlueprint(id)
  // On mobile, picking a blueprint should reveal the editor pane.
  ui.setMobileView('editor')
}
</script>

<template>
  <aside class="flex h-full w-full flex-col border-r border-border-subtle bg-surface-1 lg:w-64">
    <!-- Brand (drag handle; top padding clears the macOS traffic lights) -->
    <div data-tauri-drag-region class="flex items-center gap-2.5 px-4 pb-3 pt-4 lg:pt-9">
      <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white">
        <Icon name="layers" :size="16" />
      </div>
      <div class="flex-1">
        <div class="text-[13px] font-semibold leading-tight text-content-primary">Tailor Studio</div>
        <div class="text-[10px] text-content-muted">{{ t('app.tagline') }}</div>
      </div>
      <button
        class="rounded-lg p-1.5 text-content-muted transition-colors hover:bg-hover hover:text-content-primary"
        :title="t('settings.open')"
        @click="ui.openSettings()"
      >
        <Icon name="settings" :size="16" />
      </button>
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
          :placeholder="t('sidebar.search')"
          class="h-8 w-full bg-transparent text-[12px] text-content-primary placeholder:text-content-muted focus:outline-none"
        />
      </div>
    </div>

    <!-- Tree -->
    <nav class="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
      <div class="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-content-muted">
        {{ t('sidebar.collections') }}
      </div>
      <BlueprintTreeItem
        v-for="bp in collections"
        :key="bp.id"
        :blueprint="bp"
        :active="bp.id === store.selectedBlueprintId"
        @select="selectBlueprint(bp.id)"
        @delete="store.deleteBlueprint(bp.id)"
      />
      <p v-if="!collections.length" class="px-2 py-3 text-[12px] text-content-muted">{{ t('sidebar.noCollections') }}</p>

      <template v-if="globals.length">
        <div class="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-content-muted">
          {{ t('sidebar.globalSettings') }}
        </div>
        <BlueprintTreeItem
          v-for="bp in globals"
          :key="bp.id"
          :blueprint="bp"
          :active="bp.id === store.selectedBlueprintId"
          @select="selectBlueprint(bp.id)"
          @delete="store.deleteBlueprint(bp.id)"
        />
      </template>
    </nav>

    <!-- New blueprint + templates -->
    <div class="space-y-2 border-t border-border-subtle p-3">
      <button
        class="flex w-full items-center justify-center gap-2 rounded-lg px-3 h-9 text-[13px] font-medium text-content-secondary transition-colors hover:bg-hover hover:text-content-primary"
        @click="ui.openTemplates()"
      >
        <Icon name="sparkles" :size="15" /> {{ t('templates.open') }}
      </button>
      <NewBlueprintButton @create="create" />
    </div>
  </aside>
</template>
