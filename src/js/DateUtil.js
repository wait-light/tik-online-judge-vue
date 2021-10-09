//格式 yyyy-MM-dd HH:mm:ss
Date.prototype.toLocaleString = function() { // 重写日期函数格式化日期
    return `${this.getFullYear()}-${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}-${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()} ${this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()}:${this.getMinutes()>=10?this.getMinutes():'0'+this.getMinutes()}:${this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds()}`;
};

//格式 yyyy-MM-dd
Date.prototype.toSimpleString = function() { // 重写日期函数格式化日期
    return `${this.getFullYear()}-${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}-${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()}`;
};
