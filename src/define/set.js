const hasOwnProperty = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
}

// 定义一个 Set 构造函数
class D_Set {
    constructor() {
        this.value = {}; // value 以键值对的形式表示集合的数据
        this.n = 0; // n 集合中值的个数


        // arguments 是实际参数的一个类数组对象
        // 保证在 new D_Set(1,'sarah',{}) 初始化构造函数时调用原型上的 add 方法，将传入的参数添加到集合中
        this.add.apply(this, arguments);
    }
    // 在 D_Set 方法上定义一个自定义属性 _v2s
    // 该属性的值是一个方法，用于将传入的值转成对应的字符串（其实就像是打标签）
    static _v2s(val) {
        switch (val) {
            case undefined: return 'u'; // 如果是 undefined，就返回 'u'
            case null: return 'n';
            case true: return 't';
            case false: return 'f';
            default: switch (typeof val) {
                case 'number': return '#' + val; // 如果是数字，就添加 # 前缀 ,例如 #123, #0.5
                case 'string': return '"' + val; // 如果是字符串，就添加 " 前缀 , 例如 "hello, "world
                default: return '@' + objectId(val); // 如果是数组、函数、对象等，就添加 @ 前缀，objectId 方法会返回一个特定数字，如：@100
            }
        }

        function objectId(o) {
            var prop = "|**objectid**|"; // 给数组/ 函数/ 对象定义一个私有属性，用以存放 id
            if (!hasOwnProperty(o, prop)) { // 添加该属性前先判断该对象是否已经存在该属性
                o[prop] = D_Set._v2s.next++; // 不存在则添加该属性，值为 next
            }
            return o[prop];
        }
    }
    get() {
        return this.value;
    }
    set() {
        this.clear();
        this.add(arguments);
    }
    notify() {
        var ob = this.__ob__;
        if (ob) {
            // notify change
            ob.dep.notify();
        }
    }
    // 将每个参数添加至集合中
    add() {
        // 遍历每一个参数
        for (var i = 0; i < arguments.length; i++) {
            var val = arguments[i], // 值
                str = D_Set._v2s(val); // 键：通过值得到相应的键

            // 保证集合无重复值
            if (!hasOwnProperty(this.value, str)) {
                this.value[str] = val;
                this.n++; // 集合中值的计数加一
                this.notify();
            }
        }
        return this; // 支持链式调用
    }
    // 删除元素
    delete() {
        // 遍历每一个参数
        for (var i = 0; i < arguments.length; i++) {
            var str = D_Set._v2s(arguments[i]); // 通过值得到相应的键
            if (hasOwnProperty(this.value, str)) { // 若 value 集合中存在该属性
                delete this.value[str]; // 删除元素
                this.n--; // 集合中值的计数减一
                this.notify();
            }
        }
        return this; // 支持链式调用
    }
    // 检测是否包含某个值
    has(value) {
        return hasOwnProperty(this.value, D_Set._v2s(value));
    }
    // 返回集合的大小
    size() {
        return this.n;
    }
    // 遍历集合中的所有元素，在指定的上下文中调用回调函数 f
    forEach(f, context) {
        for (var s in this.value) {
            if (hasOwnProperty(this.value, s)) {
                f.call(context, this.value[s]);
            }
        }
    }
    // 清空
    clear() {
        this.value = {};
        this.n = 0;
        this.notify();
    }
}







// 在 D_Set._v2s.next 方法上定义一个自定义属性 next，初始值为 100
// 这样做的好处是，避免了全局变量污染，并且将该属性与对应的方法绑定在一起
D_Set._v2s.next = 100;

export const _Set = D_Set
