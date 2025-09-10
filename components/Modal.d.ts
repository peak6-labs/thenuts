/**
 * Reusable modal component
 */
import type { ModalOptions } from '../types/ui.js';
export declare class Modal {
    private container;
    private backdrop;
    private options;
    private isOpen;
    constructor(options: ModalOptions);
    private createModalStructure;
    private createButton;
    private setupEventListeners;
    private handleEscape;
    open(): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
    destroy(): void;
    static confirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void): Modal;
    static alert(title: string, message: string, onClose?: () => void): Modal;
}
/**
 * Inject modal styles into document
 */
export declare function injectModalStyles(): void;
/**
 * Default modal styles
 */
export declare function getModalStyles(): string;
//# sourceMappingURL=Modal.d.ts.map