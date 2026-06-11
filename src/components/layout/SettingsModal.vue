<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import { useSettingsStore, type ThemePref, type Locale } from '@/stores/settings'
import Icon from '@/components/ui/Icon.vue'

const ui = useUiStore()
const settings = useSettingsStore()
const { t } = useI18n()

const themes: { value: ThemePref; label: string; icon: string }[] = [
  { value: 'light', label: 'settings.themeLight', icon: 'sun' },
  { value: 'dark', label: 'settings.themeDark', icon: 'moon' },
  { value: 'system', label: 'settings.themeSystem', icon: 'monitor' },
]

const locales: { value: Locale; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
]
</script>

<template>
  <Transition name="fade">
    <div
      v-if="ui.settingsOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      @click.self="ui.closeSettings()"
    >
      <div class="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-pop">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h2 class="text-[15px] font-semibold text-content-primary">{{ t('settings.title') }}</h2>
          <button class="rounded-lg p-1.5 text-content-muted transition-colors hover:bg-hover hover:text-content-primary" @click="ui.closeSettings()">
            <Icon name="x" :size="16" />
          </button>
        </div>

        <div class="space-y-6 p-5">
          <!-- Appearance -->
          <div>
            <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-wider text-content-muted">{{ t('settings.appearance') }}</h3>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="th in themes"
                :key="th.value"
                class="flex flex-col items-center gap-2 rounded-xl border px-3 py-3 transition-colors"
                :class="settings.theme === th.value ? 'border-accent/50 bg-accent-soft text-accent' : 'border-border text-content-secondary hover:bg-hover hover:text-content-primary'"
                @click="settings.setTheme(th.value)"
              >
                <Icon :name="th.icon" :size="18" />
                <span class="text-[12px] font-medium">{{ t(th.label) }}</span>
              </button>
            </div>
          </div>

          <!-- Language -->
          <div>
            <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-wider text-content-muted">{{ t('settings.language') }}</h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="loc in locales"
                :key="loc.value"
                class="flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors"
                :class="settings.locale === loc.value ? 'border-accent/50 bg-accent-soft text-accent' : 'border-border text-content-secondary hover:bg-hover hover:text-content-primary'"
                @click="settings.setLocale(loc.value)"
              >
                <span class="text-[18px]">{{ loc.flag }}</span>
                <span class="text-[13px] font-medium">{{ loc.label }}</span>
                <Icon v-if="settings.locale === loc.value" name="check" :size="15" class="ml-auto" />
              </button>
            </div>
          </div>

          <!-- About -->
          <div class="border-t border-border-subtle pt-4 text-[12px] text-content-muted">
            Created by
            <a href="https://kristianvalco.sk" target="_blank" rel="noopener" class="font-medium text-content-secondary transition-colors hover:text-accent">Kristián Valčo</a>
            ·
            <a href="https://kristianvalco.sk" target="_blank" rel="noopener" class="text-accent transition-colors hover:text-accent-hover">kristianvalco.sk</a>
          </div>
        </div>

        <div class="flex justify-end border-t border-border-subtle px-5 py-3">
          <button class="rounded-lg bg-accent px-4 h-9 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover" @click="ui.closeSettings()">
            {{ t('settings.done') }}
          </button>
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
