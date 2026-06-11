<script setup lang="ts">
import { useUiStore, type RightTab } from '@/stores/ui'
import { useProjectIO } from '@/composables/useProjectIO'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'
import YamlPanel from '@/components/yaml/YamlPanel.vue'
import Icon from '@/components/ui/Icon.vue'

const ui = useUiStore()
const io = useProjectIO()

const tabs: { id: RightTab; label: string; icon: string }[] = [
  { id: 'preview', label: 'Preview', icon: 'box' },
  { id: 'yaml', label: 'YAML', icon: 'file-code' },
]
</script>

<template>
  <div class="flex h-full flex-col border-l border-border-subtle bg-surface-1">
    <!-- Tab bar + actions (also a window drag handle) -->
    <div data-tauri-drag-region class="flex items-center gap-2 border-b border-border-subtle px-3 py-2.5">
      <div class="flex rounded-lg bg-surface-3 p-0.5">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-1.5 rounded-md px-3 py-1 text-[12px] font-medium transition-colors"
          :class="ui.rightTab === tab.id ? 'bg-surface-1 text-content-primary shadow-sm' : 'text-content-muted hover:text-content-secondary'"
          @click="ui.setRightTab(tab.id)"
        >
          <Icon :name="tab.icon" :size="14" />
          {{ tab.label }}
        </button>
      </div>

      <div class="ml-auto flex items-center gap-1">
        <button class="io-btn" title="Import YAML" @click="io.importYaml()">
          <Icon name="file-down" :size="15" />
        </button>
        <button class="io-btn" title="Copy YAML" @click="io.copyYaml()">
          <Icon name="copy" :size="15" />
        </button>
        <button class="io-btn" title="Export YAML" @click="io.exportYaml()">
          <Icon name="download" :size="15" />
        </button>
        <button class="io-btn" title="Save project" @click="io.saveProject()">
          <Icon name="save" :size="15" />
        </button>
      </div>
    </div>

    <!-- Panel body -->
    <div class="min-h-0 flex-1">
      <KeepAlive>
        <PreviewPanel v-if="ui.rightTab === 'preview'" />
        <YamlPanel v-else />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.io-btn {
  @apply flex h-8 w-8 items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-white/5 hover:text-content-primary;
}
</style>
