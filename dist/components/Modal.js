/**
 * Reusable modal component
 */
export class Modal {
    constructor(options) {
        this.isOpen = false;
        this.options = {
            closeOnBackdrop: true,
            closeOnEscape: true,
            ...options
        };
        this.container = this.createModalStructure();
        this.backdrop = this.container.querySelector('.modal-backdrop');
        this.setupEventListeners();
    }
    createModalStructure() {
        const container = document.createElement('div');
        container.className = `modal ${this.options.className || ''}`;
        container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">${this.options.title}</h2>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer"></div>
      </div>
    `;
        // Set content
        const body = container.querySelector('.modal-body');
        if (typeof this.options.content === 'string') {
            body.innerHTML = this.options.content;
        }
        else {
            body.appendChild(this.options.content);
        }
        // Add buttons
        if (this.options.buttons && this.options.buttons.length > 0) {
            const footer = container.querySelector('.modal-footer');
            this.options.buttons.forEach(btn => {
                const button = this.createButton(btn);
                footer.appendChild(button);
            });
        }
        else {
            container.querySelector('.modal-footer').remove();
        }
        return container;
    }
    createButton(buttonConfig) {
        const button = document.createElement('button');
        button.textContent = buttonConfig.text;
        button.className = `modal-button ${buttonConfig.className || ''} ${buttonConfig.isPrimary ? 'primary' : ''}`;
        button.addEventListener('click', () => {
            buttonConfig.onClick();
            if (!buttonConfig.className?.includes('no-close')) {
                this.close();
            }
        });
        return button;
    }
    setupEventListeners() {
        // Close button
        const closeBtn = this.container.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        // Backdrop click
        if (this.options.closeOnBackdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }
        // Escape key
        if (this.options.closeOnEscape) {
            this.handleEscape = this.handleEscape.bind(this);
        }
    }
    handleEscape(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }
    open() {
        if (this.isOpen)
            return;
        // Remove any existing modals first
        const existingModals = document.querySelectorAll('.modal');
        existingModals.forEach(modal => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
        document.body.appendChild(this.container);
        // Force reflow for animation
        this.container.offsetHeight;
        this.container.classList.add('active');
        this.isOpen = true;
        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', this.handleEscape);
        }
        if (this.options.onOpen) {
            this.options.onOpen();
        }
    }
    close() {
        if (!this.isOpen)
            return;
        this.container.classList.remove('active');
        this.isOpen = false;
        if (this.options.closeOnEscape) {
            document.removeEventListener('keydown', this.handleEscape);
        }
        setTimeout(() => {
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }, 300); // Wait for animation
        if (this.options.onClose) {
            this.options.onClose();
        }
    }
    setContent(content) {
        const body = this.container.querySelector('.modal-body');
        if (typeof content === 'string') {
            body.innerHTML = content;
        }
        else {
            body.innerHTML = '';
            body.appendChild(content);
        }
    }
    destroy() {
        this.close();
        if (this.options.closeOnEscape) {
            document.removeEventListener('keydown', this.handleEscape);
        }
    }
    static confirm(title, message, onConfirm, onCancel) {
        const modal = new Modal({
            title,
            content: message,
            buttons: [
                {
                    text: 'Cancel',
                    onClick: () => {
                        if (onCancel)
                            onCancel();
                    }
                },
                {
                    text: 'Confirm',
                    onClick: onConfirm,
                    isPrimary: true
                }
            ]
        });
        modal.open();
        return modal;
    }
    static alert(title, message, onClose) {
        const modal = new Modal({
            title,
            content: message,
            buttons: [
                {
                    text: 'OK',
                    onClick: () => {
                        if (onClose)
                            onClose();
                    },
                    isPrimary: true
                }
            ]
        });
        modal.open();
        return modal;
    }
}
/**
 * Inject modal styles into document
 */
export function injectModalStyles() {
    if (document.getElementById('modal-default-styles'))
        return;
    const style = document.createElement('style');
    style.id = 'modal-default-styles';
    style.textContent = getModalStyles();
    document.head.appendChild(style);
}
/**
 * Default modal styles
 */
export function getModalStyles() {
    return `
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    
    .modal.active {
      opacity: 1;
      visibility: visible;
    }
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    
    .modal-content {
      position: relative;
      background: white;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      transform: scale(0.9);
      transition: transform 0.3s;
    }
    
    .modal.active .modal-content {
      transform: scale(1);
    }
    
    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-title {
      margin: 0;
      font-size: 1.5em;
      color: #333;
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #999;
      line-height: 1;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-close:hover {
      color: #333;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .modal-footer {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    
    .modal-button {
      padding: 10px 20px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .modal-button:hover {
      background: #f5f5f5;
    }
    
    .modal-button.primary {
      background: #C73E9A;
      color: white;
      border-color: #C73E9A;
    }
    
    .modal-button.primary:hover {
      background: #932153;
      border-color: #932153;
    }
  `;
}
//# sourceMappingURL=Modal.js.map