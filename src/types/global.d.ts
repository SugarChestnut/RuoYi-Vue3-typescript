/** 模块类型声明 */
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// element-plus
// declare module 'element-plus';
// axios
declare module 'axios';
// vue-quill
declare module '@vueup/vue-quill';

declare interface Window {
    nextLoading: boolean;
    BMAP_SATELLITE_MAP: any;
    BMap: any;
}

// file-saver
declare module 'file-saver' {
    export function saveAs(data: Blob | string, filename?: string, options?: any): void;
    export function saveAs(data: Blob | string, filename?: string, disableAutoBOM?: boolean): void;
    export default saveAs;
}

// jsencrypt
declare module 'jsencrypt/bin/jsencrypt.min' {
    import JSEncrypt from 'jsencrypt';
    export default JSEncrypt;
}

// vuedraggable
declare module 'vuedraggable/dist/vuedraggable.common' {
    import { DefineComponent } from 'vue';
    const draggable: DefineComponent;
    export default draggable;
}
