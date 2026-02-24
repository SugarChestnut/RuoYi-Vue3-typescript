// nprogress
declare module 'nprogress' {
    export interface NProgressOptions {
        minimum?: number;
        template?: string;
        easing?: string;
        speed?: number;
        trickle?: boolean;
        trickleSpeed?: number;
        showSpinner?: boolean;
        parent?: string;
        barSelector?: string;
    }

    export interface NProgress {
        start(): NProgress;
        set(n: number): NProgress;
        inc(amount?: number): NProgress;
        done(force?: boolean): NProgress;
        remove(): void;
        configure(options: NProgressOptions): NProgress;
        status: number | null;
    }

    const nprogress: NProgress;
    export default nprogress;
}
