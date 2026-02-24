// fuse
declare module 'fuse.js' {
    export interface FuseOptions<T> {
        keys: string[];
        threshold?: number;
        includeScore?: boolean;
        includeMatches?: boolean;
        minMatchCharLength?: number;
        shouldSort?: boolean;
        // 添加其他你需要的选项
    }

    export default class Fuse<T> {
        constructor(list: T[], options?: FuseOptions<T>);
        search(pattern: string): T[];
    }
}
