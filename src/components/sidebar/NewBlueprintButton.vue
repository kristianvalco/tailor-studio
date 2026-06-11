<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlueprintType } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import Icon from '@/components/ui/Icon.vue'

const emit = defineEmits<{ create: [type: BlueprintType] }>()
const { t } = useI18n()
const open = ref(false)

const types = computed<{ value: BlueprintType; label: string; icon: string; hint: string }[]>(() => [
  { value: 'single', label: t('blueprintTypes.single'), icon: 'box', hint: t('blueprintTypeHints.single') },
  { value: 'structure', label: t('blueprintTypes.structure'), icon: 'layers', hint: t('blueprintTypeHints.structure') },
  { value: 'stream', label: t('blueprintTypes.stream'), icon: 'text', hint: t('blueprintTypeHints.stream') },
  { value: 'global', label: t('blueprintTypes.global'), icon: 'settings', hint: t('blueprintTypeHints.global') },
])

function create(type: BlueprintType) {
  emit('create', type)
  open.value = false
}
</script>

<template>
  <div class="relative">
    <BaseButton variant="subtle" icon="plus" block @click="open = !open">{{ t('sidebar.newBlueprint') }}</BaseButton>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute bottom-full left-0 z-30 mb-2 w-full origin-bottom rounded-2xl border border-border bg-surface-2/95 backdrop-blur-xl shadow-pop overflow-hidden p-1.5"
      >
        <button
          v-for="t in types"
          :key="t.value"
          class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-hover"
          @click="create(t.value)"
        >
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3 text-accent">
            <Icon :name="t.icon" :size="16" />
          </span>
          <span>
            <span class="block text-[13px] font-medium text-content-primary">{{ t.label }}</span>
            <span class="block text-[11px] text-content-muted">{{ t.hint }}</span>
          </span>
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
  transform: scale(0.97) translateY(4px);
}
</style>
