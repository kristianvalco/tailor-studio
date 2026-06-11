<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResizable } from '@/composables/useResizable'
import { useIsMobile } from '@/composables/useMediaQuery'
import { useUiStore, type MobileView } from '@/stores/ui'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import BlueprintEditor from '@/components/editor/BlueprintEditor.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
import Toast from '@/components/layout/Toast.vue'
import SettingsModal from '@/components/layout/SettingsModal.vue'
import TemplatesModal from '@/components/templates/TemplatesModal.vue'
import Icon from '@/components/ui/Icon.vue'

// Right panel is resizable; invert so dragging left widens it.
const { size: rightWidth, startResize } = useResizable(440, 340, 760, { invert: true })

const isMobile = useIsMobile()
const ui = useUiStore()
const { t } = useI18n()

const mobileTabs = computed<{ id: MobileView; label: string; icon: string }[]>(() => [
  { id: 'list', label: t('nav.blueprints'), icon: 'layers' },
  { id: 'editor', label: t('nav.editor'), icon: 'pencil' },
  { id: 'right', label: t('nav.preview'), icon: 'box' },
])
</script>

<template>
  <!-- Mobile / narrow: a single pane at a time, switched via a bottom tab bar. -->
  <div
    v-if="isMobile"
    class="flex h-full w-full flex-col overflow-hidden bg-surface-0 text-content-primary"
  >
    <div class="min-h-0 flex-1 overflow-hidden">
      <Sidebar v-if="ui.mobileView === 'list'" />
      <main v-else-if="ui.mobileView === 'editor'" class="flex h-full min-w-0 flex-col">
        <BlueprintEditor />
      </main>
      <RightPanel v-else />
    </div>

    <!-- Bottom tab bar -->
    <nav
      class="grid shrink-0 grid-cols-3 border-t border-border-subtle bg-surface-1"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <button
        v-for="tab in mobileTabs"
        :key="tab.id"
        class="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
        :class="ui.mobileView === tab.id ? 'text-accent' : 'text-content-muted'"
        @click="ui.setMobileView(tab.id)"
      >
        <Icon :name="tab.icon" :size="20" />
        {{ tab.label }}
      </button>
    </nav>

    <Toast />
    <SettingsModal />
    <TemplatesModal />
  </div>

  <!-- Desktop: the classic three-pane layout. -->
  <div v-else class="flex h-full w-full overflow-hidden bg-surface-0 text-content-primary">
    <!-- macOS drag region / traffic-light spacer -->
    <div data-tauri-drag-region class="fixed inset-x-0 top-0 z-40 h-7" />

    <Sidebar />

    <main class="flex min-w-0 flex-1 flex-col pt-7">
      <BlueprintEditor />
    </main>

    <!-- Resize handle -->
    <div
      class="group relative w-px cursor-col-resize bg-border-subtle"
      @pointerdown="startResize"
    >
      <div class="absolute inset-y-0 -left-1 -right-1 group-hover:bg-accent/20 transition-colors" />
    </div>

    <section class="pt-7" :style="{ width: rightWidth + 'px' }">
      <RightPanel />
    </section>

    <Toast />
    <SettingsModal />
    <TemplatesModal />
  </div>
</template>
