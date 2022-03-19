import { createStore, createLogger } from 'vuex'
import user from '@/store/modules/user'
import group from '@/store/modules/group'
import auth from '@/store/modules/auth'
const debug = process.env.NODE_ENV !== 'production'
export default createStore({
    modules: {
        user, group, auth,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})