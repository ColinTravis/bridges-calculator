<template>
    <div class="requisition-list-container">
        <div class="requisition-bg"></div>

        <h2 class="requisition-header">
            <span class="text-cyan-500 text-3xl">⌬</span>
            Total Material Requirements
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            <div v-for="(config, type) in resourceTypes" :key="type">
                <h3 :class="['requisition-category-title', getColorClass(config.color, 'title')]">
                    <div :class="['w-1 h-1', getColorClass(config.color, 'dot')]"></div>
                    {{ config.displayName }}
                </h3>
                <ul class="space-y-2">
                    <li v-for="pack in requisitionList[type]" :key="pack.size"
                        class="flex justify-between items-baseline text-sm font-mono group">
                        <span :class="['text-gray-500 transition-colors', getColorClass(config.color, 'hover')]">
                            {{ pack.size }}
                        </span>
                        <span
                            :class="['text-gray-200 font-bold px-2 py-0.5 rounded border', getColorClass(config.color, 'badge')]">
                            x{{ pack.count }}
                        </span>
                    </li>
                    <li v-if="requisitionList[type].length === 0"
                        class="text-gray-800 text-[10px] uppercase tracking-widest">
                        No Requisition
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
const resourceTypes = {
    metal: { displayName: 'Metal', color: 'blue', colorShade: '500' },
    ceramics: { displayName: 'Ceramics', color: 'amber', colorShade: '500' },
    resin: { displayName: 'Resin', color: 'emerald', colorShade: '500' },
    chemicals: { displayName: 'Chem', color: 'purple', colorShade: '500' },
    alloys: { displayName: 'Alloys', color: 'rose', colorShade: '500' }
}

defineProps({
    requisitionList: Object
})

const colorMap = {
    blue: {
        title: 'text-blue-500',
        dot: 'bg-blue-500',
        hover: 'group-hover:text-blue-400',
        badge: 'bg-blue-900/20 border-blue-900/30'
    },
    amber: {
        title: 'text-amber-500',
        dot: 'bg-amber-500',
        hover: 'group-hover:text-amber-400',
        badge: 'bg-amber-900/20 border-amber-900/30'
    },
    emerald: {
        title: 'text-emerald-500',
        dot: 'bg-emerald-500',
        hover: 'group-hover:text-emerald-400',
        badge: 'bg-emerald-900/20 border-emerald-900/30'
    },
    purple: {
        title: 'text-purple-500',
        dot: 'bg-purple-500',
        hover: 'group-hover:text-purple-400',
        badge: 'bg-purple-900/20 border-purple-900/30'
    },
    rose: {
        title: 'text-rose-500',
        dot: 'bg-rose-500',
        hover: 'group-hover:text-rose-400',
        badge: 'bg-rose-900/20 border-rose-900/30'
    }
}

const getColorClass = (color, type) => {
    return colorMap[color]?.[type] || ''
}
</script>
