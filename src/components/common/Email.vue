<template>
    <div class="wrap" :style="commonStyle">
        <img :style="imageStyle" class="wrap-xinfeng" src="@/assets/xinfeng.png" />
        <div :style="paperStyle" class="paper">
            <slot></slot>
        </div>
        <img :style="imageStyle" class="wrap-mask" src="@/assets/mask.png" />
    </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity"
import { onMounted } from "vue"
import { propsValue2String } from "@/js/StyleUtil"
const props = defineProps({
    width: {
        type: [Number, String],
        default: 200
    },
    height: {
        type: [Number, String],
        default: 100
    },
    style: {
        type: Object,
        default: {}
    },
    bottom: {
        type: [Number, String],
    }
})
const imageStyle = computed(() => {
    return {
        width: propsValue2String(props.width)
    }
})
const commonStyle = computed(() => {
    return Object.assign(
        {
            width: propsValue2String(props.width),
            "--hover-bottom": `${props.bottom ? `${propsValue2String(props.bottom)}` : (propsValue2String(props.height))}`,
            "height": propsValue2String(props.width, 0.83)
        }, props.style
    )
})
const paperStyle = computed(() => {
    return Object.assign({
        height: `${props.height}px`,
        width: `${props.width}px`
    }, props.style)
})

</script>

<style lang="sass" scoped>

.wrap
    display: inline-block
    position: relative
    &:hover
        .paper
            box-shadow: 0px 0px 5px rgba(0,0,0,.2)
            bottom: var(--hover-bottom)
.wrap-mask,.wrap-xinfeng
    // height: 200px
    position: absolute
    left: 0
    bottom: 0
    /* 不遮挡下方元素 */
    -webkit-pointer-events: none
    -moz-pointer-events: none
    -ms-pointer-events: none
    -o-pointer-events: none
    pointer-events: none
.paper
    overflow: hidden
    left: 0
    bottom: 0
    background: white
    border: 1px solid #f8f5f1
    position: absolute
    box-sizing: border-box
    transition: all ease-in-out 0.5s
    .title
        font-size: 10px
    .info
        font-size: 10px
    // background: black
</style>