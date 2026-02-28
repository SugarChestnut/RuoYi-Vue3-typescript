import type { Tag } from '@/types';

const useTagsStore = defineStore('tags', {
    state: () => ({
        visitedTags: [] as Tag[],
        cachedTags: [] as string[],
        iframeTags: [] as Tag[],
    }),

    actions: {
        addTag(tag: Tag) {
            this.addVisitedTag(tag);
            this.addCachedTag(tag);
        },

        addIframeTag(tag: any) {
            if (this.iframeTags.some((v: any) => v.path === tag.path)) return;
            this.iframeTags.push(
                Object.assign({}, tag, {
                    title: tag.meta?.title || 'no-name',
                }),
            );
        },

        addVisitedTag(tag: Tag) {
            if (this.visitedTags.some((v) => v.path === tag.path)) return;
            this.visitedTags.push(
                Object.assign({}, tag, {
                    title: tag.meta?.title || 'no-name',
                }),
            );
        },

        addCachedTag(tag: any) {
            if (this.cachedTags.includes(tag.name)) return;
            if (!tag.meta?.noCache) {
                this.cachedTags.push(tag.name);
            }
        },

        delTag(tag: any) {
            return new Promise<{ visitedTags: Tag[]; cachedTags: string[] }>((resolve) => {
                this.delVisitedTag(tag);
                this.delCachedTag(tag);
                resolve({
                    visitedTags: [...this.visitedTags],
                    cachedTags: [...this.cachedTags],
                });
            });
        },

        delVisitedTag(tag: any) {
            return new Promise<Tag[]>((resolve) => {
                for (const [i, v] of this.visitedTags.entries()) {
                    if (v.path === tag.path) {
                        this.visitedTags.splice(i, 1);
                        break;
                    }
                }
                this.iframeTags = this.iframeTags.filter((item: any) => item.path !== tag.path);
                resolve([...this.visitedTags]);
            });
        },

        delIframeTag(tag: any) {
            return new Promise<Tag[]>((resolve) => {
                this.iframeTags = this.iframeTags.filter((item: any) => item.path !== tag.path);
                resolve([...this.iframeTags]);
            });
        },

        delCachedTag(tag: any) {
            return new Promise<string[]>((resolve) => {
                const index = this.cachedTags.indexOf(tag.name);
                index > -1 && this.cachedTags.splice(index, 1);
                resolve([...this.cachedTags]);
            });
        },

        delOthersTags(tag: any) {
            return new Promise<{ visitedTags: Tag[]; cachedTags: string[] }>((resolve) => {
                this.delOthersvisitedTags(tag);
                this.delOtherscachedTags(tag);
                resolve({
                    visitedTags: [...this.visitedTags],
                    cachedTags: [...this.cachedTags],
                });
            });
        },

        delOthersvisitedTags(tag: any) {
            return new Promise<Tag[]>((resolve) => {
                this.visitedTags = this.visitedTags.filter((v: any) => {
                    return v.meta?.affix || v.path === tag.path;
                });
                this.iframeTags = this.iframeTags.filter((item: any) => item.path === tag.path);
                resolve([...this.visitedTags]);
            });
        },

        delOtherscachedTags(tag: any) {
            return new Promise<string[]>((resolve) => {
                const index = this.cachedTags.indexOf(tag.name);
                if (index > -1) {
                    this.cachedTags = this.cachedTags.slice(index, index + 1);
                } else {
                    this.cachedTags = [];
                }
                resolve([...this.cachedTags]);
            });
        },

        delAllTags(tag?: any) {
            return new Promise<{ visitedTags: Tag[]; cachedTags: string[] }>((resolve) => {
                this.delAllvisitedTags(tag);
                this.delAllcachedTags(tag);
                resolve({
                    visitedTags: [...this.visitedTags],
                    cachedTags: [...this.cachedTags],
                });
            });
        },

        delAllvisitedTags(tag: any) {
            return new Promise<Tag[]>((resolve) => {
                const affixTags = this.visitedTags.filter((tag: any) => tag.meta?.affix);
                this.visitedTags = affixTags;
                this.iframeTags = [];
                resolve([...this.visitedTags]);
            });
        },

        delAllcachedTags(tag: any) {
            return new Promise<string[]>((resolve) => {
                this.cachedTags = [];
                resolve([...this.cachedTags]);
            });
        },

        updateVisitedTag(tag: any) {
            for (let v of this.visitedTags) {
                if (v.path === tag.path) {
                    v = Object.assign(v, tag);
                    break;
                }
            }
        },

        delRightTags(tag: any) {
            return new Promise<Tag[]>((resolve) => {
                const index = this.visitedTags.findIndex((v: any) => v.path === tag.path);
                if (index === -1) {
                    return;
                }
                this.visitedTags = this.visitedTags.filter((item: any, idx: number) => {
                    if (idx <= index || (item.meta && item.meta.affix)) {
                        return true;
                    }
                    if (item.name) {
                        const i = this.cachedTags.indexOf(item.name);
                        if (i > -1) {
                            this.cachedTags.splice(i, 1);
                        }
                    }
                    if (item.meta?.link) {
                        const fi = this.iframeTags.findIndex((v: any) => v.path === item.path);
                        this.iframeTags.splice(fi, 1);
                    }
                    return false;
                });
                resolve([...this.visitedTags]);
            });
        },

        delLeftTags(tag: any) {
            return new Promise<Tag[]>((resolve) => {
                const index = this.visitedTags.findIndex((v: any) => v.path === tag.path);
                if (index === -1) {
                    return;
                }
                this.visitedTags = this.visitedTags.filter((item: any, idx: number) => {
                    if (idx >= index || (item.meta && item.meta.affix)) {
                        return true;
                    }
                    if (item.name) {
                        const i = this.cachedTags.indexOf(item.name);
                        if (i > -1) {
                            this.cachedTags.splice(i, 1);
                        }
                    }
                    if (item.meta?.link) {
                        const fi = this.iframeTags.findIndex((v: any) => v.path === item.path);
                        this.iframeTags.splice(fi, 1);
                    }
                    return false;
                });
                resolve([...this.visitedTags]);
            });
        },
    },
});

export default useTagsStore;
