<template>
    <div class="result-card">
        <div class="result-card-strip"></div>

        <div class="p-6">
            <div class="result-header">
                <h3 class="text-2xl font-bold text-gray-100 uppercase tracking-widest flex items-center gap-3">
                    <span class="text-yellow-500 text-sm">/// ID:</span>
                    {{ item.name }}
                </h3>
                <button @click="$emit('remove')" class="btn-cancel">
                    Cancel Requisition
                </button>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <ResourceResult v-for="(config, type) in resourceTypes" :key="type" :name="config.displayName"
                    :color="config.color" :color-shade="config.colorShade" :result="item[`${type}Result`]" />
            </div>
        </div>
    </div>
</template>

<script setup>
const resourceTypes = {
    metal: { displayName: 'Metal', color: 'blue', colorShade: '400' },
    ceramics: { displayName: 'Ceramics', color: 'amber', colorShade: '500' },
    resin: { displayName: 'Resin', color: 'emerald', colorShade: '500' },
    chemicals: { displayName: 'Chem.', color: 'purple', colorShade: '500' },
    alloys: { displayName: 'Alloys', color: 'rose', colorShade: '500' }
}

defineProps({
    item: Object
})

defineEmits(['remove'])
</script>
