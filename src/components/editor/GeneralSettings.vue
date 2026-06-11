<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Blueprint, BlueprintType } from '@/types'
import { slugifyBlueprintHandle } from '@/utils/handle'
import FormRow from '@/components/ui/FormRow.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import IconPicker from '@/components/fields/IconPicker.vue'

const props = defineProps<{ blueprint: Blueprint }>()
const { t } = useI18n()

const typeOptions = computed<{ value: BlueprintType; label: string }[]>(() => [
  { value: 'single', label: t('blueprintTypes.single') },
  { value: 'structure', label: t('blueprintTypes.structure') },
  { value: 'stream', label: t('blueprintTypes.stream') },
  { value: 'global', label: t('blueprintTypes.global') },
])

const prevName = ref(props.blueprint.name)

function onNameInput(value: string) {
  const bp = props.blueprint
  // Keep the handle tracking the name until it's been hand-edited.
  if (!bp.handle || bp.handle === slugifyBlueprintHandle(prevName.value)) {
    bp.handle = slugifyBlueprintHandle(value)
  }
  if (!bp.navigation) bp.navigation = {}
  if (!bp.navigation.label || bp.navigation.label === prevName.value) {
    bp.navigation.label = value
  }
  bp.name = value
  prevName.value = value
}
</script>

<template>
  <section class="space-y-4">
    <div class="cq-grid-2 gap-4">
      <FormRow :label="t('general.name')">
        <BaseInput :model-value="blueprint.name" placeholder="Products" @update:model-value="onNameInput" />
      </FormRow>
      <FormRow :label="t('general.handle')" :help="t('general.handleHelp')">
        <BaseInput
          :model-value="blueprint.handle"
          placeholder="Shop\Products"
          mono
          @update:model-value="(v) => (blueprint.handle = v)"
        />
      </FormRow>
    </div>

    <div class="cq-grid-3 gap-4">
      <FormRow :label="t('general.type')">
        <BaseSelect
          :model-value="blueprint.type"
          :options="typeOptions"
          @update:model-value="(v) => (blueprint.type = v as BlueprintType)"
        />
      </FormRow>
      <FormRow :label="t('general.navLabel')">
        <BaseInput
          :model-value="blueprint.navigation?.label ?? ''"
          placeholder="Products"
          @update:model-value="(v) => (blueprint.navigation = { ...blueprint.navigation, label: v })"
        />
      </FormRow>
      <FormRow :label="t('general.navIcon')" :help="t('general.navIconHelp')">
        <IconPicker
          :model-value="blueprint.navigation?.icon ?? ''"
          @update:model-value="(v) => (blueprint.navigation = { ...blueprint.navigation, icon: v })"
        />
      </FormRow>
    </div>
  </section>
</template>
