<template>
    <div class="catalog-container">
        <a
            :name="`${tocItem.name}-anchor`"
            class="catalog-link"
            :style="style"
            :title="tocItem.text"
            :href="`${tocItem.href}`"
        >{{ tocItem.text }}</a>
    </div>
    <div v-if="tocItem.children">
        <catalog-link v-for="item of tocItem.children" :key="item.href" :tocItem="item" />
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
    "padding-left": `${(tocItem.level) * 20}px`,
})
</script>
<style lang="sass" scoped>

@import '@/sass/_variables'
.catalog-container
    width: 100%
    overflow: hidden
.catalog-link
    white-space: nowrap
    text-overflow: ellipsis
    color: #000
    padding: 5px
    display: inline-block
    overflow: hidden
    line-height: 15px
    font-size: 13px
    width: 100%
    margin: 0 10px
    border-radius: $large-radius
    &:hover
        background: $auxiliary-color
</style>
