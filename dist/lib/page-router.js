/**
 * Lightweight router using page.js library
 * Replaces custom router with battle-tested solution
 */
import page from 'page';
export class PageRouter {
    constructor(options) {
        this.routes = new Map();
        this.currentModule = null;
        this.currentPath = '';
        this.useHash = options.useHash ?? false;
        this.container = options.container ?? document.getElementById('app');
        // Register routes
        options.routes.forEach(route => {
            this.routes.set(route.path, route);
            // For hash routing, we need to handle the hash ourselves
            if (this.useHash) {
                // Register with page.js without hash
                this.registerRoute(route);
            }
            else {
                this.registerRoute(route);
            }
        });
        // Set up hash routing manually since page.js hash support is limited
        if (this.useHash) {
            // Handle hash changes
            window.addEventListener('hashchange', () => this.handleHashChange());
            // Handle initial load
            setTimeout(() => this.handleHashChange(), 0);
        }
        else {
            // Start page.js normally for non-hash routing
            page.start({ dispatch: true });
        }
    }
    handleHashChange() {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0];
        const route = this.routes.get(path) || this.routes.get('/');
        if (route) {
            this.loadRoute(route);
        }
    }
    async loadRoute(route) {
        // Save current state before navigating
        this.saveState();
        // Unmount current module
        if (this.currentModule && this.currentModule.unmount) {
            this.currentModule.unmount();
        }
        // Update current path
        this.currentPath = route.path;
        // Update page title
        document.title = route.title;
        // Load and mount new module
        try {
            const module = await route.loader();
            this.currentModule = module;
            // Clear container
            this.container.innerHTML = '';
            // Try to restore state
            const savedState = this.loadState();
            // Mount the new module
            module.mount(this.container, savedState);
            // If we have saved state, deserialize it
            if (savedState && module.deserialize) {
                module.deserialize(savedState);
            }
        }
        catch (error) {
            console.error(`Failed to load route ${route.path}:`, error);
            this.container.innerHTML = '<h1>Error loading game</h1>';
        }
    }
    registerRoute(route) {
        if (!this.useHash) {
            // Only register with page.js for non-hash routing
            page(route.path, async (_ctx) => {
                await this.loadRoute(route);
            });
        }
    }
    getStateKey() {
        return `game-state-${this.currentPath}`;
    }
    saveState() {
        if (this.currentModule && this.currentModule.serialize) {
            const state = this.currentModule.serialize();
            const key = this.getStateKey();
            sessionStorage.setItem(key, JSON.stringify(state));
        }
    }
    loadState() {
        const key = this.getStateKey();
        const saved = sessionStorage.getItem(key);
        if (saved) {
            try {
                return JSON.parse(saved);
            }
            catch {
                sessionStorage.removeItem(key);
            }
        }
        return undefined;
    }
    // Public navigation method
    navigate(path, replace = false) {
        this.saveState();
        if (this.useHash) {
            // For hash routing, update the hash directly
            const hashPath = path.startsWith('#') ? path : `#${path}`;
            if (replace) {
                window.location.replace(hashPath);
            }
            else {
                window.location.hash = path;
            }
        }
        else {
            // For regular routing, use page.js
            if (replace) {
                page.replace(path);
            }
            else {
                page(path);
            }
        }
    }
    // Get URL parameters
    getParams() {
        if (this.useHash) {
            const hash = window.location.hash.slice(1);
            const queryIndex = hash.indexOf('?');
            if (queryIndex !== -1) {
                return new URLSearchParams(hash.slice(queryIndex + 1));
            }
            return new URLSearchParams();
        }
        return new URLSearchParams(window.location.search);
    }
    // Update URL params without navigation
    updateParams(params) {
        const searchParams = new URLSearchParams(params);
        const query = searchParams.toString();
        const path = this.currentPath + (query ? `?${query}` : '');
        if (this.useHash) {
            const url = `#${path}`;
            window.history.replaceState({}, '', url);
        }
        else {
            window.history.replaceState({}, '', path);
        }
    }
    // Stop the router (useful for cleanup)
    stop() {
        page.stop();
    }
}
// Export singleton instance helper
let routerInstance = null;
export function initRouter(options) {
    if (routerInstance) {
        console.warn('Router already initialized');
        return routerInstance;
    }
    routerInstance = new PageRouter(options);
    return routerInstance;
}
export function getRouter() {
    return routerInstance;
}
// Re-export page.js for direct access if needed
export { page };
//# sourceMappingURL=page-router.js.map