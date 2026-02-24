// sortablejs
declare module 'sortablejs' {
    export interface SortableEvent {
        oldIndex: number;
        newIndex: number;
    }

    export interface SortableOptions {
        ghostClass?: string;
        onEnd?: (evt: SortableEvent) => void;
    }

    export default class Sortable {
        static create(el: HTMLElement, options: SortableOptions): Sortable;
    }
}
