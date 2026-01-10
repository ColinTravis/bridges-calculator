<template>
    <div :class="`resource-result-box border-${color}-900/30`">
        <div class="resource-result-header">
            <span :class="`resource-result-name text-${color}-${colorShade}`">{{ name }}</span>
            <span class="resource-result-status" :class="result.overflow > 0 ? 'text-red-400' : 'text-gray-600'">
                {{ result.overflow > 0 ? `+${result.overflow} OVR` : 'OPTIMAL' }}
            </span>
        </div>
        <div class="text-sm font-mono mt-2">
            <div :class="`resource-pack-display border-${color}-600 text-${color}-100`">
                {{ formatPacks(result.packs) }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    name: String,
    color: String,
    colorShade: { type: String, default: '400' },
    result: Object
})

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
