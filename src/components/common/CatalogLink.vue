<template>
    <div>
        <el-link :style="style" :href="tocItem.href">{{ tocItem.text }}</el-link>
    </div>

    <div v-if="tocItem.children" class="catalog-container">
        <CatalogLink v-for="item of tocItem.children" :key="item.href" :tocItem="item" />
    </div>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref } from 'vue';
import { TocItem } from '@/components/common/TocTtem';
const { tocItem } = defineProps({
    tocItem: {
        type: Object as PropType<TocItem>,
        default: () => ({})
    },
    class: [Object, String]
});
const style = ref({
    "font-size": `${(6 - tocItem.level) * 1 + 12}px`,
    "margin-left": `${(tocItem.level) * 20}px`,
    "font-weight": `${(6 - tocItem.level) * 100 + 50}`
})
</script>
