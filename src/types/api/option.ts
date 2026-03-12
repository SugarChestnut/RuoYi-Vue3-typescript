export interface Option<T = string | number | boolean> {
    /** 选项值 */
    value: T;
    /** 选项标签 */
    label: string;
}