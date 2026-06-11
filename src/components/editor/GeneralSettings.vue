<script setup lang="ts">
import { ref } from 'vue'
import type { Blueprint, BlueprintType } from '@/types'
import { slugifyBlueprintHandle } from '@/utils/handle'
import FormRow from '@/components/ui/FormRow.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const props = defineProps<{ blueprint: Blueprint }>()

const typeOptions: { value: BlueprintType; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'structure', label: 'Structure' },
  { value: 'stream', label: 'Stream' },
  { value: 'global', label: 'Global' },
]

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
      <FormRow label="Name">
        <BaseInput :model-value="blueprint.name" placeholder="Products" @update:model-value="onNameInput" />
      </FormRow>
      <FormRow label="Handle" help="Unique Tailor identifier, e.g. Blog\Post">
        <BaseInput
          :model-value="blueprint.handle"
          placeholder="Shop\Products"
          mono
          @update:model-value="(v) => (blueprint.handle = v)"
        />
      </FormRow>
    </div>

    <div class="cq-grid-3 gap-4">
      <FormRow label="Type">
        <BaseSelect
          :model-value="blueprint.type"
          :options="typeOptions"
          @update:model-value="(v) => (blueprint.type = v as BlueprintType)"
        />
      </FormRow>
      <FormRow label="Navigation Label">
        <BaseInput
          :model-value="blueprint.navigation?.label ?? ''"
          placeholder="Products"
          @update:model-value="(v) => (blueprint.navigation = { ...blueprint.navigation, label: v })"
        />
      </FormRow>
      <FormRow label="Navigation Icon" help="OctoberCMS icon class">
        <BaseInput
          :model-value="blueprint.navigation?.icon ?? ''"
          placeholder="icon-shopping-cart"
          mono
          @update:model-value="(v) => (blueprint.navigation = { ...blueprint.navigation, icon: v })"
        />
      </FormRow>
    </div>
  </section>
</template>
