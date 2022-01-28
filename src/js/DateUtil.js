import moment from "moment"
//格式 yyyy-MM-dd HH:mm:ss
Date.prototype.toLocaleString = function () { // 重写日期函数格式化日期
    return `${this.getFullYear()}-${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}-${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()} ${this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()}:${this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes()}:${this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds()}`;
};
//xxxx年xx月xx日
Date.prototype.toChineseDateShortString = function () { // 重写日期函数格式化日期
    return `${this.getFullYear()}年${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}月${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()}日`;
};
//xxxx年xx月xx日 xx时xx分xx秒
Date.prototype.toChineseDateLongString = function () { // 重写日期函数格式化日期
    return `${this.getFullYear()}年${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}月${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()}日${this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()}时${this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes()}分${this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds()}秒`;
};

//格式 yyyy-MM-dd
Date.prototype.toSimpleString = function () { // 重写日期函数格式化日期
    return `${this.getFullYear()}-${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}-${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()}`;
};

//格式 yyyy/MM/dd xx:xx:xx
Date.prototype.toTypecalString = function () { // 重写日期函数格式化日期
    return `${this.getFullYear()}/${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}/${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()} ${this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()}:${this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes()}:${this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds()}`;
};

Date.prototype.toISOString = function () {
    return moment(this).format('YYYY-MM-DD HH:mm:ss')
}
