import { RouterOptions } from '../types/router.js';
export declare class Router {
    private routes;
    private currentModule;
    private currentPath;
    private container;
    private useHash;
    constructor(options: RouterOptions);
    private getPath;
    private getStateKey;
    private saveState;
    private loadState;
    private handlePopState;
    private handleInitialNavigation;
    navigate(path: string, replace?: boolean): Promise<void>;
    private navigateToPath;
    getParams(): URLSearchParams;
    updateParams(params: Record<string, string>): void;
}
export declare function initRouter(options: RouterOptions): Router;
export declare function getRouter(): Router | null;
//# sourceMappingURL=router.d.ts.map