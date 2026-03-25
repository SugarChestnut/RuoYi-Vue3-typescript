/** Vite 环境变量类型 */
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_BASE_URI: string;
    readonly VITE_IS_REQUEST_PROXY: boolean;
    readonly VITE_API_URL: string;
    readonly VITE_API_PREFIX: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
