/*eslint-disable*/
export function guid(isShort) {
    const s = (isShort ? 'yxxxxxxyxx' : 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return s.toLowerCase();
}

let _stampId = 0;

export function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
};

export function stamp(obj) {
    var key = '_p_id_';
    obj[key] = obj[key] || _stampId++;
    return obj[key];
};
export function combineOpts(dest) {
	var i, j, len, src;
	for (j = 1, len = arguments.length; j < len; j++) {
		src = arguments[j];
		for (i in src) {
			dest[i] = src[i];
		}
	}
	return dest;
}
//--简单对象的拷贝。不支持function 等
export function deepcopy(object) {
	return JSON.parse(JSON.stringify(object));
}
//--fix dyj 为了绑定事件的时候，不支持传递scope.
export function connectEvent(target, event_name, fn, scope) {

	if (!target.on || typeof target.on != 'function')
		return;

	if (!fn || !event_name)
		return;

	const $fn = (e) => {
		fn.call(scope || null, e);
	}

	target.on(event_name, $fn);

	return $fn;
}
//--fix dyj 为了避免解绑定事件的时候，fn传递空导致解绑所有类型的事件封装
export function disconnectEvent(target, event_name, fn) {
	if (!target.un || typeof target.un != 'function')
		return;

	if (!fn || !event_name)
		return;

	target.un(event_name, fn);
}