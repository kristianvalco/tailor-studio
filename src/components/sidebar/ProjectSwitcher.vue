<script setup lang="ts">
/** Active-project selector with create / rename / duplicate / delete. */
import { nextTick, ref } from 'vue'
import { useProjectStore } from '@/stores/projects'
import { useBlueprintStore } from '@/stores/blueprints'
import Icon from '@/components/ui/Icon.vue'

const projects = useProjectStore()
const store = useBlueprintStore()

const open = ref(false)
const editingId = ref<string | null>(null)
const draft = ref('')
const renameInput = ref<HTMLInputElement>()

function switchTo(id: string) {
  if (id !== projects.activeProjectId) store.switchProject(id)
  open.value = false
}

function create() {
  store.newProject('New Project')
  // Drop straight into rename for the freshly created project.
  startRename(projects.activeProjectId!, 'New Project')
}

async function startRename(id: string, current: string) {
  editingId.value = id
  draft.value = current
  await nextTick()
  renameInput.value?.focus()
  renameInput.value?.select()
}

function commitRename() {
  if (editingId.value && draft.value.trim()) {
    projects.renameProject(editingId.value, draft.value.trim())
  }
  editingId.value = null
}

function remove(id: string) {
  if (projects.projects.length === 1) return
  projects.deleteProject(id)
  store.syncSelection()
}
</script>

<template>
  <div class="relative">
    <button
      class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/5"
      @click="open = !open"
    >
      <Icon name="folder" :size="15" class="text-content-muted" />
      <span class="flex-1 truncate text-[12px] font-medium text-content-primary">
        {{ projects.activeProject?.name ?? 'No project' }}
      </span>
      <Icon name="chevron-down-up" :size="13" class="text-content-muted" />
    </button>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute left-0 right-0 top-full z-30 mt-1.5 origin-top rounded-2xl border border-border bg-surface-2/95 p-1.5 shadow-pop backdrop-blur-xl"
      >
        <div class="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-content-muted">
          Projects
        </div>

        <div
          v-for="p in projects.projects"
          :key="p.id"
          class="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
        >
          <Icon
            name="check"
            :size="14"
            :class="p.id === projects.activeProjectId ? 'text-accent' : 'opacity-0'"
          />
          <input
            v-if="editingId === p.id"
            ref="renameInput"
            v-model="draft"
            class="flex-1 rounded bg-surface-4 px-1.5 py-0.5 text-[12px] text-content-primary focus:outline-none"
            @keyup.enter="commitRename"
            @keyup.esc="editingId = null"
            @blur="commitRename"
            @click.stop
          />
          <button v-else class="flex-1 truncate text-left text-[12px] text-content-primary" @click="switchTo(p.id)">
            {{ p.name }}
            <span class="ml-1 text-[10px] text-content-muted">{{ p.blueprints.length }}</span>
          </button>

          <div v-if="editingId !== p.id" class="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
            <button class="rounded p-1 text-content-muted hover:text-content-primary" title="Rename" @click.stop="startRename(p.id, p.name)">
              <Icon name="pencil" :size="13" />
            </button>
            <button class="rounded p-1 text-content-muted hover:text-content-primary" title="Duplicate" @click.stop="projects.duplicateProject(p.id); store.syncSelection()">
              <Icon name="copy" :size="13" />
            </button>
            <button
              class="rounded p-1 text-content-muted hover:text-red-400 disabled:opacity-30"
              title="Delete"
              :disabled="projects.projects.length === 1"
              @click.stop="remove(p.id)"
            >
              <Icon name="trash-2" :size="13" />
            </button>
          </div>
        </div>

        <div class="my-1 h-px bg-border-subtle" />
        <button
          class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] text-content-secondary transition-colors hover:bg-white/5 hover:text-content-primary"
          @click="create"
        >
          <Icon name="folder-plus" :size="15" /> New project
        </button>
      </div>
    </Transition>

    <div v-if="open" class="fixed inset-0 z-20" @click="open = false" />
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(-4px);
}
</style>
