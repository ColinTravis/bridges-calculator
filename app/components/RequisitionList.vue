<template>
    <div class="requisition-list-container">
        <div class="requisition-bg"></div>

        <h2 class="requisition-header">
            <span class="text-cyan-500 text-3xl">⌬</span>
            Total Material Requirements
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            <div v-for="(config, type) in resourceTypes" :key="type">
                <h3 :class="`requisition-category-title text-${config.color}-${config.colorShade}`">
                    <div :class="`w-1 h-1 bg-${config.color}-${config.colorShade}`"></div>
                    {{ config.displayName }}
                </h3>
                <ul class="space-y-2">
                    <li v-for="pack in requisitionList[type]" :key="pack.size"
                        class="flex justify-between items-baseline text-sm font-mono group">
                        <span :class="`text-gray-500 group-hover:text-${config.color}-400 transition-colors`">
                            {{ pack.size }}
                        </span>
                        <span
                            :class="`text-gray-200 font-bold bg-${config.color}-900/20 px-2 py-0.5 rounded border border-${config.color}-900/30`">
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
</script>
