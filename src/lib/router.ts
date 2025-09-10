import { GameModule, Route, RouterOptions, GameState } from '../types/router.js';

export class Router {
  private routes: Map<string, Route> = new Map();
  private currentModule: GameModule | null = null;
  private currentPath: string = '';
  private container: HTMLElement;
  private useHash: boolean;
  
  constructor(options: RouterOptions) {
    this.useHash = options.useHash ?? false;
    this.container = options.container ?? document.getElementById('app')!;
    
    // Register routes
    options.routes.forEach(route => {
      this.routes.set(route.path, route);
    });
    
    // Listen for browser navigation
    window.addEventListener('popstate', () => this.handlePopState());
    
    // Handle initial navigation
    this.handleInitialNavigation();
  }
  
  private getPath(): string {
    if (this.useHash) {
      return window.location.hash.slice(1) || '/';
    }
    return window.location.pathname;
  }
  
  private getStateKey(): string {
    return `game-state-${this.currentPath}`;
  }
  
  private saveState(): void {
    if (this.currentModule && this.currentModule.serialize) {
      const state = this.currentModule.serialize();
      const key = this.getStateKey();
      sessionStorage.setItem(key, JSON.stringify(state));
    }
  }
  
  private loadState(): GameState | undefined {
    const key = this.getStateKey();
    const saved = sessionStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        sessionStorage.removeItem(key);
      }
    }
    return undefined;
  }
  
  private async handlePopState(): Promise<void> {
    await this.navigateToPath(this.getPath(), false);
  }
  
  private async handleInitialNavigation(): Promise<void> {
    const path = this.getPath();
    await this.navigateToPath(path, false);
  }
  
  async navigate(path: string, replace: boolean = false): Promise<void> {
    // Save current state before navigating away
    this.saveState();
    
    // Update browser history
    const url = this.useHash ? `#${path}` : path;
    if (replace) {
      window.history.replaceState({ path }, '', url);
    } else {
      window.history.pushState({ path }, '', url);
    }
    
    await this.navigateToPath(path, false);
  }
  
  private async navigateToPath(path: string, saveCurrentState: boolean = true): Promise<void> {
    // Clean up path
    const cleanPath = path.split('?')[0].split('#')[0];
    
    // Find matching route
    const route = this.routes.get(cleanPath) || this.routes.get('/');
    if (!route) {
      console.error(`No route found for path: ${cleanPath}`);
      return;
    }
    
    // Save current game state if needed
    if (saveCurrentState) {
      this.saveState();
    }
    
    // Unmount current module
    if (this.currentModule && this.currentModule.unmount) {
      this.currentModule.unmount();
    }
    
    // Update current path
    this.currentPath = cleanPath;
    
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
    } catch (error) {
      console.error(`Failed to load route ${cleanPath}:`, error);
      this.container.innerHTML = '<h1>Error loading game</h1>';
    }
  }
  
  // Helper to get URL params
  getParams(): URLSearchParams {
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
  updateParams(params: Record<string, string>): void {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    const path = this.currentPath + (query ? `?${query}` : '');
    const url = this.useHash ? `#${path}` : path;
    window.history.replaceState({ path: this.currentPath }, '', url);
  }
}

// Export singleton instance helper
let routerInstance: Router | null = null;

export function initRouter(options: RouterOptions): Router {
  if (routerInstance) {
    console.warn('Router already initialized');
    return routerInstance;
  }
  routerInstance = new Router(options);
  return routerInstance;
}

export function getRouter(): Router | null {
  return routerInstance;
}