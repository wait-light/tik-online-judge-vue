const releasePathReg = [/^\/passwordrest /, /^\/login/,/^\/passwordrest/]
/**
 * 判断是否满足无需拦截的路径
 */
export default function isReleasePath(path) {
    for (let index = 0; index < releasePathReg.length; index++) {
        const element = releasePathReg[index];
        if (element.test(path)) {
            return true
        }
    }
    return false
}

