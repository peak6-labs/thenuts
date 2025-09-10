export interface GameState {
  [key: string]: any;
}

export interface GameModule {
  mount(container: HTMLElement, state?: GameState): void;
  unmount?(): void;
  serialize(): GameState;
  deserialize(state: GameState): void;
}

export interface Route {
  path: string;
  title: string;
  loader: () => Promise<GameModule>;
}

export interface RouterOptions {
  useHash?: boolean;
  container?: HTMLElement;
  routes: Route[];
}