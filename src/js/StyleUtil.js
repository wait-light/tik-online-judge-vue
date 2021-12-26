const alphabetReg = /[a-zA-Z]+/g
const numberReg = /[0-9]+/g
export const propsValue2String = (value, multypulNumer) => {
    if (typeof value == "number") {
        return `${value}px`
    } else if (typeof value == "string") {
        if(value.indexOf("calc") != 0){
            return value
        }
        let number = value.match(numberReg)
        let alphabet = value.match(alphabetReg)
        if (!number || !alphabet) {
            throw new Error(`字符串 ${value} 格式不正确`);
        }
        if (multypulNumer) {
            number = Number.parseInt(number) * multypulNumer
            number = Math.floor(number)
        }
        return number + alphabet
    }
}