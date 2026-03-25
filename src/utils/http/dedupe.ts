const pendingMap = new Map<string, AbortController>();

const DEBOUNCE_DELAY = 300;
const debounceTimers = new Map<string, NodeJS.Timeout>();

export function getKey(config: any) {
    const { url, method, params, data } = config;
    return [method, url, normalizeParam(params), normalizeParam(data)].join('&');
}

export function addPending(config: any) {
    const key = getKey(config);
    if (pendingMap.has(key)) {
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort(); // 立即取消本次请求
        return;
    }
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingMap.set(key, controller);
}

export function removePending(config: any) {
    const key = getKey(config);
    if (pendingMap.has(key)) {
        pendingMap.delete(key);
    }
}

// 规范化参数：空对象、undefined、null 都转为空字符串
const normalizeParam = (param: any) => {
    if (param === undefined || param === null) return '';
    if (typeof param === 'object' && Object.keys(param).length === 0) return '';
    // 确保对象属性排序一致
    if (typeof param === 'object') {
        const sorted = sortObjectKeys(param);
        if (Object.keys(sorted).length === 0) return '{}';
        return JSON.stringify(sorted);
    }
    return '' + param;
};

// 对象属性排序函数
function sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortObjectKeys);
    const sorted: any = {};
    Object.keys(obj)
        .sort()
        .forEach((key) => {
            if (obj[key] === undefined || obj[key] === null) {
                return;
            }
            sorted[key] = sortObjectKeys(obj[key]);
        });
    return sorted;
}
