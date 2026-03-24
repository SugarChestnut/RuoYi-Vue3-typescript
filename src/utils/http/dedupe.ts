const pendingMap = new Map<string, AbortController>();

const DEBOUNCE_DELAY = 300;
const debounceTimers = new Map<string, NodeJS.Timeout>();

export function getKey(config: any) {
    const { url, method, params, data } = config;
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
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
