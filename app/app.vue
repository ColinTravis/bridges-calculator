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

// Helper to format pack list like "2x 800, 1x 200"
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
            <!-- Metal -->
            <div class="resource-card hover:border-blue-500/50">
              <h3 class="resource-title text-blue-400 border-blue-900/30 group-hover:text-blue-300">Metal</h3>
              <div class="space-y-3">
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Cur</label>
                  <input v-model.number="newItem.metal.current" type="number" min="0"
                    class="resource-stat-input focus:border-blue-500 text-gray-300" />
                </div>
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Tgt</label>
                  <input v-model.number="newItem.metal.target" type="number" min="0"
                    class="resource-stat-input focus:border-blue-500 text-blue-100" />
                </div>
              </div>
            </div>

            <!-- Ceramics -->
            <div class="resource-card hover:border-amber-500/50">
              <h3 class="resource-title text-amber-500 border-amber-900/30 group-hover:text-amber-300">Ceramics</h3>
              <div class="space-y-3">
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Cur</label>
                  <input v-model.number="newItem.ceramics.current" type="number" min="0"
                    class="resource-stat-input focus:border-amber-500 text-gray-300" />
                </div>
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Tgt</label>
                  <input v-model.number="newItem.ceramics.target" type="number" min="0"
                    class="resource-stat-input focus:border-amber-500 text-amber-100" />
                </div>
              </div>
            </div>

            <!-- Resin -->
            <div class="resource-card hover:border-emerald-500/50">
              <h3 class="resource-title text-emerald-500 border-emerald-900/30 group-hover:text-emerald-300">Resin</h3>
              <div class="space-y-3">
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Cur</label>
                  <input v-model.number="newItem.resin.current" type="number" min="0"
                    class="resource-stat-input focus:border-emerald-500 text-gray-300" />
                </div>
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Tgt</label>
                  <input v-model.number="newItem.resin.target" type="number" min="0"
                    class="resource-stat-input focus:border-emerald-500 text-emerald-100" />
                </div>
              </div>
            </div>

            <!-- Chemicals -->
            <div class="resource-card hover:border-purple-500/50">
              <h3 class="resource-title text-purple-500 border-purple-900/30 group-hover:text-purple-300">Chemicals</h3>
              <div class="space-y-3">
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Cur</label>
                  <input v-model.number="newItem.chemicals.current" type="number" min="0"
                    class="resource-stat-input focus:border-purple-500 text-gray-300" />
                </div>
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Tgt</label>
                  <input v-model.number="newItem.chemicals.target" type="number" min="0"
                    class="resource-stat-input focus:border-purple-500 text-purple-100" />
                </div>
              </div>
            </div>

            <!-- Alloys -->
            <div class="resource-card hover:border-rose-500/50">
              <h3 class="resource-title text-rose-500 border-rose-900/30 group-hover:text-rose-300">Alloys</h3>
              <div class="space-y-3">
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Cur</label>
                  <input v-model.number="newItem.alloys.current" type="number" min="0"
                    class="resource-stat-input focus:border-rose-500 text-gray-300" />
                </div>
                <div class="resource-stat-row">
                  <label class="resource-stat-label">Tgt</label>
                  <input v-model.number="newItem.alloys.target" type="number" min="0"
                    class="resource-stat-input focus:border-rose-500 text-rose-100" />
                </div>
              </div>
            </div>
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
        <div v-for="item in analyzedItems" :key="item.id" class="result-card">
          <!-- Left accent strip -->
          <div class="result-card-strip"></div>

          <div class="p-6">
            <div class="result-header">
              <h3 class="text-2xl font-bold text-gray-100 uppercase tracking-widest flex items-center gap-3">
                <span class="text-yellow-500 text-sm">/// ID:</span>
                {{ item.name }}
              </h3>
              <button @click="removeItem(item.id)" class="btn-cancel">
                Cancel Requisition
              </button>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <!-- Metal Result -->
              <div class="resource-result-box border-blue-900/30">
                <div class="resource-result-header">
                  <span class="resource-result-name text-blue-400">Metal</span>
                  <span class="resource-result-status"
                    :class="item.metalResult.overflow > 0 ? 'text-red-400' : 'text-gray-600'">
                    {{ item.metalResult.overflow > 0 ? `+${item.metalResult.overflow} OVR` : 'OPTIMAL' }}
                  </span>
                </div>
                <div class="text-sm font-mono mt-2">
                  <div class="resource-pack-display border-blue-600 text-blue-100">
                    {{ formatPacks(item.metalResult.packs) }}
                  </div>
                </div>
              </div>

              <!-- Ceramics Result -->
              <div class="resource-result-box border-amber-900/30">
                <div class="resource-result-header">
                  <span class="resource-result-name text-amber-500">Ceramics</span>
                  <span class="resource-result-status"
                    :class="item.ceramicsResult.overflow > 0 ? 'text-red-400' : 'text-gray-600'">
                    {{ item.ceramicsResult.overflow > 0 ? `+${item.ceramicsResult.overflow} OVR` : 'OPTIMAL' }}
                  </span>
                </div>
                <div class="text-sm font-mono mt-2">
                  <div class="resource-pack-display border-amber-600 text-amber-100">
                    {{ formatPacks(item.ceramicsResult.packs) }}
                  </div>
                </div>
              </div>

              <!-- Resin Result -->
              <div class="resource-result-box border-emerald-900/30">
                <div class="resource-result-header">
                  <span class="resource-result-name text-emerald-500">Resin</span>
                  <span class="resource-result-status"
                    :class="item.resinResult.overflow > 0 ? 'text-red-400' : 'text-gray-600'">
                    {{ item.resinResult.overflow > 0 ? `+${item.resinResult.overflow} OVR` : 'OPTIMAL' }}
                  </span>
                </div>
                <div class="text-sm font-mono mt-2">
                  <div class="resource-pack-display border-emerald-600 text-emerald-100">
                    {{ formatPacks(item.resinResult.packs) }}
                  </div>
                </div>
              </div>

              <!-- Chemicals Result -->
              <div class="resource-result-box border-purple-900/30">
                <div class="resource-result-header">
                  <span class="resource-result-name text-purple-500">Chem.</span>
                  <span class="resource-result-status"
                    :class="item.chemicalsResult.overflow > 0 ? 'text-red-400' : 'text-gray-600'">
                    {{ item.chemicalsResult.overflow > 0 ? `+${item.chemicalsResult.overflow} OVR` : 'OPTIMAL' }}
                  </span>
                </div>
                <div class="text-sm font-mono mt-2">
                  <div class="resource-pack-display border-purple-600 text-purple-100">
                    {{ formatPacks(item.chemicalsResult.packs) }}
                  </div>
                </div>
              </div>

              <!-- Alloys Result -->
              <div class="resource-result-box border-rose-900/30">
                <div class="resource-result-header">
                  <span class="resource-result-name text-rose-500">Alloys</span>
                  <span class="resource-result-status"
                    :class="item.alloysResult.overflow > 0 ? 'text-red-400' : 'text-gray-600'">
                    {{ item.alloysResult.overflow > 0 ? `+${item.alloysResult.overflow} OVR` : 'OPTIMAL' }}
                  </span>
                </div>
                <div class="text-sm font-mono mt-2">
                  <div class="resource-pack-display border-rose-600 text-rose-100">
                    {{ formatPacks(item.alloysResult.packs) }}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Requisition List -->
      <div v-if="items.length > 0" class="requisition-list-container">
        <div class="requisition-bg"></div>

        <h2 class="requisition-header">
          <span class="text-cyan-500 text-3xl">⌬</span>
          Total Material Requirements
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">

          <!-- Metal List -->
          <div>
            <h3 class="requisition-category-title text-blue-500">
              <div class="w-1 h-1 bg-blue-500"></div> Metal
            </h3>
            <ul class="space-y-2">
              <li v-for="pack in totalRequisitionList.metal" :key="pack.size"
                class="flex justify-between items-baseline text-sm font-mono group">
                <span class="text-gray-500 group-hover:text-blue-400 transition-colors">{{ pack.size }}</span>
                <span class="text-gray-200 font-bold bg-blue-900/20 px-2 py-0.5 rounded border border-blue-900/30">x{{
                  pack.count }}</span>
              </li>
              <li v-if="totalRequisitionList.metal.length === 0"
                class="text-gray-800 text-[10px] uppercase tracking-widest">No Requisition</li>
            </ul>
          </div>

          <!-- Ceramics List -->
          <div>
            <h3 class="requisition-category-title text-amber-500">
              <div class="w-1 h-1 bg-amber-500"></div> Ceramics
            </h3>
            <ul class="space-y-2">
              <li v-for="pack in totalRequisitionList.ceramics" :key="pack.size"
                class="flex justify-between items-baseline text-sm font-mono group">
                <span class="text-gray-500 group-hover:text-amber-400 transition-colors">{{ pack.size }}</span>
                <span class="text-gray-200 font-bold bg-amber-900/20 px-2 py-0.5 rounded border border-amber-900/30">x{{
                  pack.count }}</span>
              </li>
              <li v-if="totalRequisitionList.ceramics.length === 0"
                class="text-gray-800 text-[10px] uppercase tracking-widest">No Requisition</li>
            </ul>
          </div>

          <!-- Resin List -->
          <div>
            <h3 class="requisition-category-title text-emerald-500">
              <div class="w-1 h-1 bg-emerald-500"></div> Resin
            </h3>
            <ul class="space-y-2">
              <li v-for="pack in totalRequisitionList.resin" :key="pack.size"
                class="flex justify-between items-baseline text-sm font-mono group">
                <span class="text-gray-500 group-hover:text-emerald-400 transition-colors">{{ pack.size }}</span>
                <span
                  class="text-gray-200 font-bold bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-900/30">x{{
                    pack.count }}</span>
              </li>
              <li v-if="totalRequisitionList.resin.length === 0"
                class="text-gray-800 text-[10px] uppercase tracking-widest">No Requisition</li>
            </ul>
          </div>

          <!-- Chemicals List -->
          <div>
            <h3 class="requisition-category-title text-purple-500">
              <div class="w-1 h-1 bg-purple-500"></div> Chem
            </h3>
            <ul class="space-y-2">
              <li v-for="pack in totalRequisitionList.chemicals" :key="pack.size"
                class="flex justify-between items-baseline text-sm font-mono group">
                <span class="text-gray-500 group-hover:text-purple-400 transition-colors">{{ pack.size }}</span>
                <span
                  class="text-gray-200 font-bold bg-purple-900/20 px-2 py-0.5 rounded border border-purple-900/30">x{{
                    pack.count }}</span>
              </li>
              <li v-if="totalRequisitionList.chemicals.length === 0"
                class="text-gray-800 text-[10px] uppercase tracking-widest">No Requisition</li>
            </ul>
          </div>

          <!-- Alloys List -->
          <div>
            <h3 class="requisition-category-title text-rose-500">
              <div class="w-1 h-1 bg-rose-500"></div> Alloys
            </h3>
            <ul class="space-y-2">
              <li v-for="pack in totalRequisitionList.alloys" :key="pack.size"
                class="flex justify-between items-baseline text-sm font-mono group">
                <span class="text-gray-500 group-hover:text-rose-400 transition-colors">{{ pack.size }}</span>
                <span class="text-gray-200 font-bold bg-rose-900/20 px-2 py-0.5 rounded border border-rose-900/30">x{{
                  pack.count }}</span>
              </li>
              <li v-if="totalRequisitionList.alloys.length === 0"
                class="text-gray-800 text-[10px] uppercase tracking-widest">No Requisition</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
