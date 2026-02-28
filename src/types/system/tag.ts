export interface TagMeta {
    title?: string;
    noCache?: boolean;
    affix?: boolean;
    link?: string;
    [key: string]: any;
}

export interface Tag {
    name: string;
    path: string;
    meta: TagMeta;
}