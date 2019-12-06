//--fix dyj 多继承。目前还有缺陷
function mix(...mixins) {
    class Mix {
        constructor(...ags) {
            for (let mixin of mixins) {
                copyProperties(this, new mixin(ags)); // 拷贝实例属性
            }
        }
    }

    for (let mixin of mixins) {
        copyProperties(Mix, mixin); // 拷贝静态属性
        copyProperties(Mix.prototype, mixin.prototype,true); // 拷贝原型属性
    }

    return Mix;
}

function copyProperties(target, source,deep) {
    for (var key of Reflect.ownKeys(source)) {
        if (key !== 'constructor'
            && key !== 'prototype'
            && key !== 'name'
            && key !== 'length'//--fix ie不支持拷贝函数对象的length属性
        ) {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
    if (deep && source.__proto__ && target.__proto__) {
        target.__proto__ = source.__proto__;

        // for (let key2 of Reflect.ownKeys(source.__proto__)) {
        //     let desc = Object.getOwnPropertyDescriptor(source.__proto__, key2);
        //     Object.defineProperty(target.__proto__, key2, desc);
        //     copyProperties(target.__proto__,source.__proto__);
        // }
    }
}
export default mix;