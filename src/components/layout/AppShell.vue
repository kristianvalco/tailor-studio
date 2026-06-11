<script setup lang="ts">
import { useResizable } from '@/composables/useResizable'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import BlueprintEditor from '@/components/editor/BlueprintEditor.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
import Toast from '@/components/layout/Toast.vue'
import SettingsModal from '@/components/layout/SettingsModal.vue'

// Right panel is resizable; invert so dragging left widens it.
const { size: rightWidth, startResize } = useResizable(440, 340, 760, { invert: true })
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-surface-0 text-content-primary">
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
  </div>
</template>
