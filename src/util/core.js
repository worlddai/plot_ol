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
