<template>
    <div :class="['resource-result-box', boxBorderClass]">
        <div class="resource-result-header">
            <span :class="['resource-result-name', nameTextClass]">{{ name }}</span>
            <span class="resource-result-status" :class="result.overflow > 0 ? 'text-red-400' : 'text-gray-600'">
                {{ result.overflow > 0 ? `+${result.overflow} OVR` : 'OPTIMAL' }}
            </span>
        </div>
        <div class="text-sm font-mono mt-2">
            <div :class="['resource-pack-display', packBorderClass, packTextClass]">
                {{ formatPacks(result.packs) }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    name: String,
    color: String,
    colorShade: { type: String, default: '400' },
    result: Object
})

const colorClasses = {
    blue: {
        boxBorder: 'border-blue-900/30',
        nameText: 'text-blue-400',
        packBorder: 'border-blue-600',
        packText: 'text-blue-100'
    },
    amber: {
        boxBorder: 'border-amber-900/30',
        nameText: 'text-amber-500',
        packBorder: 'border-amber-600',
        packText: 'text-amber-100'
    },
    emerald: {
        boxBorder: 'border-emerald-900/30',
        nameText: 'text-emerald-500',
        packBorder: 'border-emerald-600',
        packText: 'text-emerald-100'
    },
    purple: {
        boxBorder: 'border-purple-900/30',
        nameText: 'text-purple-500',
        packBorder: 'border-purple-600',
        packText: 'text-purple-100'
    },
    rose: {
        boxBorder: 'border-rose-900/30',
        nameText: 'text-rose-500',
        packBorder: 'border-rose-600',
        packText: 'text-rose-100'
    }
}

const boxBorderClass = computed(() => colorClasses[props.color]?.boxBorder || '')
const nameTextClass = computed(() => colorClasses[props.color]?.nameText || '')
const packBorderClass = computed(() => colorClasses[props.color]?.packBorder || '')
const packTextClass = computed(() => colorClasses[props.color]?.packText || '')

const formatPacks = (packs) => {
    if (packs.length === 0) return 'None'

    const counts = {}
    packs.forEach(p => counts[p] = (counts[p] || 0) + 1)

    return Object.entries(counts)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([size, count]) => `${count}x ${size}`)
        .join(', ')
}
</script>
