export interface Tag {
    name: string;
    path: string;
    meta: TagMeta;
}

export interface TagMeta {
    title?: string;
    isCache?: boolean;
    affix?: boolean;
    fullPath?: string;
    link?: string;
    [key: string]: any;
}