<template>
    <div :class="props.class" name="tik-catalog">
        <div class="catalog-title">目录</div>
        <el-divider></el-divider>
        <catalog-link v-for="item of catalogs" :key="item.href" :tocItem="item"></catalog-link>
    </div>
    <!-- <el-link>{{ item.text }}</el-link> -->
</template>

<script setup lang="ts">
import { computed, PropType, defineProps, onMounted, onUpdated } from 'vue';
import CatalogLink from "@/components/common/CatalogLink.vue"
import { TocItem } from "@/components/common/TocTtem"

const props = defineProps({
    heads: {
        type: Array as PropType<Array<any>>
    },
    class: String, Object,
    browsingClass: {
        default: `catalog-browsing`
    }
});
const tocItems: TocItem[] = [];
const targetDocuments = []
const catalogDocuments = []
var cataLogSelf
var lastNameDocument = null
onMounted(() => {
    if (!getTargetByUrl(window.location.href)) {
        window.location.href = window.location.href + "#"
    }
    window.addEventListener("scroll", upBrowsing);
    window.addEventListener("hashchange", (hash) => {
        toTarget(hash)
    }, false);
    cataLogSelf = document.getElementsByName("tik-catalog")[0]
    // window.onhashchange = upBrowsing
})
const getTargetByUrl = (url) => {
    let urlArray = url.split("#")
    if (!urlArray) {
        return
    }
    return urlArray[1]
}
const toTarget = (hash) => {
    let newIndex = getTargetByUrl(hash.newURL)
    // let oldIndex = getTargetByUrl(hash.oldURL)s
    let now = findTargetByname(newIndex)
    if (now) {
        now.classList.add(props.browsingClass)
        // console.log(now.offsetTop);
        // console.log();
        //到目录中部
        // console.log(now.offsetTop + (cataLogSelf.clientHeight / 2));
        cataLogSelf.scrollTo(0, now.offsetTop - cataLogSelf.clientHeight / 2 + now.scrollHeight / 2)
    }
    if (lastNameDocument) {
        lastNameDocument.classList.remove(props.browsingClass)
    }
    lastNameDocument = now
}
const findTargetByname = (name) => {
    for (let index = 0; index < catalogDocuments.length; index++) {
        const element = catalogDocuments[index];
        if (element.name == name) {
            return element
        }
    }
}
const upBrowsing = () => {
    let index = 0
    for (const item of targetDocuments) {
        const target = item
        if (target) {
            // console.log(target);

            let minY = target.offsetTop
            minY -= 50
            let maxY = minY + target.offsetHeight
            // console.log(`minY:${minY} maxY:${maxY} windows:${window.scrollY}`);

            if (window.scrollY >= minY && window.scrollY <= maxY) {
                const current = catalogDocuments[index]
                if (lastNameDocument && current != lastNameDocument) {
                    lastNameDocument.classList.remove(props.browsingClass)
                }
                if (current == lastNameDocument) {
                    return
                } else {
                    current.classList.add(props.browsingClass)
                    cataLogSelf.scrollTo(0, current.offsetTop - cataLogSelf.clientHeight / 2 + current.scrollHeight / 2)

                }
                lastNameDocument = current
                return
            }

        }
        index++
    }
}
const prepareDocument = (tocs) => {
    for (const item of tocs) {
        const target = document.getElementById(item.name)
        const catalogItem = document.getElementsByName(item.name)
        if (catalogItem && catalogItem.length > 0) {
            catalogItem[0].name = item.name
            catalogDocuments.push(catalogItem[0])
        }
        if (target) {
            targetDocuments.push(target)
        }
        if (item.children && item.children.length > 0) {
            prepareDocument(item.children)
        }
    }
}
onUpdated(() => {
    targetDocuments.splice(0, targetDocuments.length);
    catalogDocuments.splice(0, catalogDocuments.length)
    prepareDocument(tocItems)
    // console.log(catalogDocuments,tocItems);
    upBrowsing()
})
const catalogs = computed(() => {
    let num = 1
    let levels = [1, 1, 1, 1, 1, 1, 1]
    let lastLevel = 1
    tocItems.splice(0, tocItems.length)
    props.heads?.forEach(({ text, level }) => {
        if (level > lastLevel) {
            levels[level] = 1
        }
        let name = `heading-${num}`
        lastLevel = level
        text = `${levels[lastLevel]++}. ${text}`
        const item = { level, text, href: `#heading-${num++}`, name };
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
    const item = {
        text: "评论",
        href: "#comment",
        level: 1,
        children: null,
        name: "comment"
    }
    tocItems.push(item)
    // console.log(tocItems);

    return tocItems;
});
</script>
<style lang="sass">
.catalog-browsing
    font-weight: 800
    color: var(--el-color-primary) !important
.catalog-title
    margin: 10px 0 -15px 20px
    font-size: 16px
    font-weight: 500
</style>