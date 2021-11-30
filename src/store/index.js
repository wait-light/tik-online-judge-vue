import { createStore, createLogger } from 'vuex'
import user from '@/store/modules/user'
import group from '@/store/modules/group'
const debug = process.env.NODE_ENV !== 'production'
export default createStore({
    modules: {
        user, group
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})