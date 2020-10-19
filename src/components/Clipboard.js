import Clipboard from 'clipboard';

export default class {

  static attach(selector) {
    const clipboard = new Clipboard(selector);
    clipboard.on('success', event => {
      if (this.listeners && this.listeners.success) this.listeners.success(event);
    });
    return this;
  }

  static on(type, listener) {
    if (!this.listeners) {
      this.listeners = {};
      this.listeners[type] = listener;
    }
    return this;
  }
}