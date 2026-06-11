<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { blueprintTemplates, type BlueprintTemplate } from '@/data/templates'
import { useUiStore } from '@/stores/ui'
import { useBlueprintStore } from '@/stores/blueprints'
import Icon from '@/components/ui/Icon.vue'

const ui = useUiStore()
const store = useBlueprintStore()
const { t, te } = useI18n()

const categories = ['content', 'commerce', 'settings'] as const

const grouped = computed(() =>
  categories
    .map((cat) => ({ cat, items: blueprintTemplates.filter((tpl) => tpl.category === cat) }))
    .filter((g) => g.items.length),
)

function name(tpl: BlueprintTemplate): string {
  const key = `template.${tpl.id}.name`
  return te(key) ? t(key) : tpl.name
}
function desc(tpl: BlueprintTemplate): string {
  const key = `template.${tpl.id}.description`
  return te(key) ? t(key) : tpl.description
}

function use(tpl: BlueprintTemplate) {
  store.addBlueprintFromTemplate(tpl)
  ui.closeTemplates()
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="ui.templatesOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10 backdrop-blur-sm"
      @click.self="ui.closeTemplates()"
    >
      <div class="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-pop">
        <!-- Header -->
        <div class="flex items-start justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <h2 class="text-[16px] font-semibold text-content-primary">{{ t('templates.title') }}</h2>
            <p class="mt-0.5 text-[13px] text-content-muted">{{ t('templates.subtitle') }}</p>
          </div>
          <button class="rounded-lg p-1.5 text-content-muted transition-colors hover:bg-hover hover:text-content-primary" @click="ui.closeTemplates()">
            <Icon name="x" :size="16" />
          </button>
        </div>

        <div class="max-h-[70vh] space-y-6 overflow-y-auto p-6">
          <div v-for="group in grouped" :key="group.cat">
            <div class="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-content-muted">
              {{ t('templateCategories.' + group.cat) }}
            </div>
            <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <button
                v-for="tpl in group.items"
                :key="tpl.id"
                class="group flex flex-col gap-2 rounded-xl border border-border bg-surface-1 p-3.5 text-left transition-colors hover:border-accent/40 hover:bg-surface-3"
                @click="use(tpl)"
              >
                <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon :name="tpl.icon" :size="18" />
                </span>
                <span class="text-[13px] font-semibold text-content-primary">{{ name(tpl) }}</span>
                <span class="text-[11px] leading-snug text-content-muted">{{ desc(tpl) }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
