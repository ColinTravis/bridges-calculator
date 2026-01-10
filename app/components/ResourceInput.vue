<template>
    <div :class="`resource-card hover:border-${color}-500/50`">
        <h3 :class="`resource-title text-${color}-${colorShade} border-${color}-900/30 group-hover:text-${color}-300`">
            {{ name }}
        </h3>
        <div class="space-y-3">
            <div class="resource-stat-row">
                <label class="resource-stat-label">Current</label>
                <input :value="modelValue.current" @input="updateValue('current', $event.target.value)" type="text"
                    min="0" :class="`resource-stat-input focus:border-${color}-500 text-gray-300`" />
            </div>
            <div class="resource-stat-row">
                <label class="resource-stat-label">Target</label>
                <input :value="modelValue.target" @input="updateValue('target', $event.target.value)" type="text"
                    min="0" :class="`resource-stat-input focus:border-${color}-500 text-${color}-100`" />
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    name: String,
    color: String,
    colorShade: { type: String, default: '400' },
    modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (field, value) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: Number(value) || 0
    })
}
</script>
