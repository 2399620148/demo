<template>
  <div class="w-full not-prose relative bg-slate-50 rounded overflow-hidden dark:bg-slate-800/25 border-gray-100 border">
    <div style="background-position:10px 10px" class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>

    <div class="relative rounded overflow-auto">
      <div class="shadow-sm overflow-hidden">
        <table class="border-collapse table-auto w-full text-sm">
          <thead>
            <tr>
              <th class="border-b dark:border-slate-600 font-medium px-2 py-3 text-slate-400 dark:text-slate-200 text-left" v-for="item in props.columns" :class="{ 'text-center': item.align === 'center' }">
                {{item.title}}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800">
            <tr v-for="(item, index) in props.data" :key="item._id" class="hover:bg-gray-50">
              
              <template v-for="col in props.columns">
                <td class="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400" v-if="slots[col.key]" :style="{width: col.width ? col.width + 'px' : 'auto'}">

                  <!-- <slot
                    :name="col.key"
                    :data="index"
                    v-if="col.key === 'index'"
                  >
                  {{index}}
                  </slot> -->

                  <div class="flex items-center justify-between w-full ml-4" v-if="col.key === 'index'">{{index + 1}}</div>
                  <slot
                    :name="col.key"
                    :data="item"
                    v-else
                  >
                  </slot>
                </td>
                <td class="border-b border-slate-100 dark:border-slate-700 px-2 py-3 text-slate-500 dark:text-slate-400" :style="{width: col.width ? col.width + 'px' : 'auto'}" v-else>
                  {{item[col.key] ? item[col.key] : ''}}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>

  const props = defineProps({
    columns: Array,
    data: Array
  })
  const slots = useSlots()
</script>