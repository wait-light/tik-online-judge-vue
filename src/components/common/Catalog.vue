<template>
    <div :class="props.class">
        <catalog-link v-for="item of catalogs" :key="item.href" :tocItem="item"></catalog-link>
    </div>

    <!-- <el-link>{{ item.text }}</el-link> -->
</template>

<script setup lang="ts">
import { computed, PropType, defineProps } from 'vue';
import CatalogLink from "@/components/common/CatalogLink.vue"
import { TocItem } from "@/components/common/TocTtem"

const props = defineProps({
    heads: {
        type: Array as PropType<Array<any>>
    },
    class: String
});

const catalogs = computed(() => {
    const tocItems: TocItem[] = [];
    let num = 1
    let levels = [1, 1, 1, 1, 1, 1, 1]
    let lastLevel = 1
    props.heads?.forEach(({ text, level }) => {
        if (level > lastLevel) {
            levels[level] = 1
        }
        lastLevel = level
        text = `${levels[lastLevel]++}. ${text}`
        const item = { level, text, href: `#heading-${num++}` };
        if (tocItems.length === 0) {
            // 第一个 item 直接 push
            tocItems.push(item);
        } else {
            let lastItem = tocItems[tocItems.length - 1]; // 最后一个 item

            if (item.level > lastItem.level) {
                // item 是 lastItem 的 children
                for (let i = lastItem.level + 1; i <= 6; i++) {
                    const { children } = lastItem;
                    if (!children) {
                        // 如果 children 不存在
                        lastItem.children = [item];
                        break;
                    }
                    lastItem = children[children.length - 1]; // 重置 lastItem 为 children 的最后一个 item

                    if (item.level <= lastItem.level) {
                        // item level 小于或等于 lastItem level 都视为与 children 同级
                        children.push(item);
                        break;
                    }
                }
            } else {
                // 置于最顶级
                tocItems.push(item);
            }
        }
    });
    return tocItems;
});
</script>
<style scoped>
.catalog-container {
    max-height: 300px;
    overflow: auto;
}
</style>
