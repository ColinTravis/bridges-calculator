<script setup>
const { solve } = useOptimizer()

const resourceTypes = {
  metal: { increments: [1000, 800, 600, 400, 200, 100, 50], color: 'blue' },
  ceramics: { increments: [800, 640, 480, 320, 160, 80, 40], color: 'amber' },
  resin: { increments: [800, 640, 480, 320, 160, 80, 40], color: 'emerald' },
  chemicals: { increments: [600, 480, 360, 240, 120, 60, 30], color: 'purple' },
  alloys: { increments: [1200, 960, 720, 480, 240, 120, 60], color: 'rose' }
}

// State
const items = ref([])
const newItemName = ref('')
const newItem = ref({
  metal: { current: 0, target: 0 },
  ceramics: { current: 0, target: 0 },
  resin: { current: 0, target: 0 },
  chemicals: { current: 0, target: 0 },
  alloys: { current: 0, target: 0 }
})

// Actions
const addItem = () => {
  if (!newItemName.value) return

  items.value.push({
    id: crypto.randomUUID(),
    name: newItemName.value,
    ...Object.fromEntries(
      Object.entries(newItem.value).map(([key, val]) => [key, { ...val }])
    )
  })

  // Reset form
  newItemName.value = ''
  Object.keys(newItem.value).forEach(key => {
    newItem.value[key] = { current: 0, target: 0 }
  })
}

const removeItem = (id) => {
  items.value = items.value.filter(i => i.id !== id)
}

const resourceConfigs = [
  { key: 'metal', name: 'Metal', color: 'blue', colorShade: '400' },
  { key: 'ceramics', name: 'Ceramics', color: 'amber', colorShade: '500' },
  { key: 'resin', name: 'Resin', color: 'emerald', colorShade: '500' },
  { key: 'chemicals', name: 'Chemicals', color: 'purple', colorShade: '500' },
  { key: 'alloys', name: 'Alloys', color: 'rose', colorShade: '500' }
]

// Computations
const analyzedItems = computed(() => {
  return items.value.map(item => {
    const results = {}
    Object.keys(resourceTypes).forEach(type => {
      const needed = Math.max(0, item[type].target - item[type].current)
      results[`${type}Result`] = solve(needed, resourceTypes[type].increments)
    })
    return { ...item, ...results }
  })
})

const totalRequisitionList = computed(() => {
  const counts = Object.fromEntries(
    Object.keys(resourceTypes).map(type => [type, {}])
  )

  analyzedItems.value.forEach(item => {
    Object.keys(resourceTypes).forEach(type => {
      item[`${type}Result`].packs.forEach(p => {
        counts[type][p] = (counts[type][p] || 0) + 1
      })
    })
  })

  const formatList = (record) => Object.entries(record)
    .map(([size, count]) => ({ size: Number(size), count }))
    .sort((a, b) => b.size - a.size)

  return Object.fromEntries(
    Object.keys(resourceTypes).map(type => [type, formatList(counts[type])])
  )
})
</script>

<template>
  <div class="bridges-container">
    <!-- Map texture background hint -->
    <div class="bridges-bg-grid"></div>

    <div class="max-w-7xl mx-auto space-y-12 relative z-10">

      <!-- Header -->
      <header class="bridges-header">
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80">
        </div>

        <h1 class="bridges-title">
          Bridges Resource Calculator
        </h1>
        <div class="bridges-status">
          <span>/// Network Status: Online ///</span>
        </div>
      </header>

      <!-- Add Item Form -->
      <div class="bridges-panel">
        <div class="bridges-panel-corner-tr"></div>
        <div class="bridges-panel-corner-bl"></div>

        <h2 class="text-xl font-bold mb-8 text-cyan-400 flex items-center gap-3 uppercase tracking-wider">
          <span class="text-yellow-400 animate-pulse">►</span>
          Initiate New Requisition Order
        </h2>

        <div class="space-y-6">
          <div>
            <label class="block text-xs text-cyan-500/70 uppercase tracking-widest mb-2 px-1">Structure / Designation
              ID</label>
            <input v-model="newItemName" type="text" placeholder="ENTER DESIGNATION..." class="bridges-input-main"
              @keyup.enter="addItem" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <ResourceInput v-for="config in resourceConfigs" :key="config.key" :name="config.name" :color="config.color"
              :color-shade="config.colorShade" v-model="newItem[config.key]" />
          </div>

          <button @click="addItem" class="btn-requisition">
            <span class="relative z-10">Process Requisition</span>
            <div
              class="absolute inset-0 bg-cyan-400/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300">
            </div>
          </button>
        </div>
      </div>

      <!-- Results System -->
      <div v-if="items.length > 0" class="space-y-6">
        <ItemCard v-for="item in analyzedItems" :key="item.id" :item="item" @remove="removeItem(item.id)" />
      </div>

      <!-- Requisition List -->
      <RequisitionList v-if="items.length > 0" :requisition-list="totalRequisitionList" />

    </div>
  </div>
</template>
