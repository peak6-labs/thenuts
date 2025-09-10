/**
 * Lightweight router using page.js library
 * Replaces custom router with battle-tested solution
 */
import page from 'page';
import type { RouterOptions } from '../types/router.js';
export declare class PageRouter {
    private routes;
    private currentModule;
    private currentPath;
    private container;
    private useHash;
    constructor(options: RouterOptions);
    private handleHashChange;
    private loadRoute;
    private registerRoute;
    private getStateKey;
    private saveState;
    private loadState;
    navigate(path: string, replace?: boolean): void;
    getParams(): URLSearchParams;
    updateParams(params: Record<string, string>): void;
    stop(): void;
}
export declare function initRouter(options: RouterOptions): PageRouter;
export declare function getRouter(): PageRouter | null;
export { page };
//# sourceMappingURL=page-router.d.ts.map