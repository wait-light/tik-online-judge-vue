<template>
    <div :class="props.class" name="tik-catalog">
        <div class="catalog-title">目录</div>
        <el-divider></el-divider>
        <catalog-link v-for="item of catalogs" :key="item.href" :tocItem="item"></catalog-link>
    </div>
</template>

<script setup lang="ts">
import { computed, PropType, onMounted, onUpdated } from 'vue';
import CatalogLink from "@/components/common/CatalogLink.vue"
import { TocItem } from "@/components/common/TocTtem"

const props = defineProps({
    heads: {
        type: Array as PropType<Array<any>>
    },
    class: String, Object,
    browsingClass: {
        default: `catalog-browsing`
    },
    anchorOffset: {
        type: Number,
        default: 0
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
    let now = findTargetByname(newIndex)

    if (now) {
        now.classList.add(props.browsingClass)
        //到目录中部
        cataLogSelf.scrollTo(0, now.offsetTop - cataLogSelf.clientHeight / 2 + now.scrollHeight / 2)
    }
    if (lastNameDocument && lastNameDocument != now) {
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
    for (let index = 0; index < targetDocuments.length; index++) {
        const target = targetDocuments[index];
        if (target) {
            let minY = target.offsetTop + props.anchorOffset
            let maxY = 0
            if (index + 1 < targetDocuments.length) {
                maxY = targetDocuments[index + 1].offsetTop + props.anchorOffset
            } else {
                maxY = minY + target.offsetHeight
            }
            //锚点位于窗口中，点亮目录中的对应点
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
    }
}
const prepareDocument = (tocs) => {
    for (const item of tocs) {
        const target = document.getElementById(item.name)
        const catalogItem = document.getElementsByName(`${item.name}-anchor`)
        if (catalogItem && catalogItem.length > 0) {
            catalogDocuments.push(catalogItem[0])
        }
        if (target) {
            // targetDocuments.push(target)
            let tikAnchor = target.getElementsByClassName("tik-anchor")
            if (tikAnchor.length == 0) {
                let anchor = document.createElement('a');
                anchor.id = `${item.name}-anchor`
                anchor.className = "tik-anchor"
                let offset = props.anchorOffset
                anchor.setAttribute("style", `display: block; position: relative; height: 0;top: ${offset}px;`)
                target.insertAdjacentElement("beforebegin", anchor)
                const autoAnchor = target.getElementsByTagName("a")
                if (autoAnchor.length > 0) {
                    const autoAnchorItem = autoAnchor[0]
                    autoAnchorItem.href = `#${item.name}-anchor`
                }
                targetDocuments.push(anchor)
            }

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
        const item = { level, text, href: `#heading-${num++}-anchor`, name };
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