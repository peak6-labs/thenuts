/**
 * Type definitions for UI components
 */

export interface ModalOptions {
  title: string;
  content: string | HTMLElement;
  buttons?: ModalButton[];
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  onClose?: () => void;
  onOpen?: () => void;
}

export interface ModalButton {
  text: string;
  onClick: () => void;
  className?: string;
  isPrimary?: boolean;
}

export interface TimerOptions {
  duration: number; // in seconds
  onTick?: (remaining: number) => void;
  onComplete?: () => void;
  format?: 'mm:ss' | 'seconds';
  showWarning?: boolean;
  warningThreshold?: number; // seconds remaining to show warning
  allowPause?: boolean;
}

export interface ScoreDisplayOptions {
  current: number;
  total: number;
  showStreak?: boolean;
  streak?: number;
  showAccuracy?: boolean;
  accuracy?: number;
  className?: string;
}

export interface ProgressIndicatorOptions {
  current: number;
  total: number;
  showNumbers?: boolean;
  style?: 'dots' | 'bar' | 'steps';
  className?: string;
}

export interface ToastOptions {
  message: string;
  duration?: number; // milliseconds
  type?: 'success' | 'error' | 'info' | 'warning';
  position?: 'top' | 'bottom' | 'center';
  className?: string;
}

export interface ButtonOptions {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  icon?: string;
}

export interface MenuOptions {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  className?: string;
  showHighScores?: boolean;
}

export interface MenuItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  highScore?: number;
  locked?: boolean;
  unlockRequirement?: string;
}