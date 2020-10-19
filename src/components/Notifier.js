import AWN from "awesome-notifications"

export default class {

  /**
   * List positions
   * @return {string}
   */
  static get position() {
    return {
      BOTTOM_RIGHT: 'bottom-right',
      BOTTOM_LEFT: 'bottom-left',
      TOP_RIGHT: 'top-right',
      TOP_LEFT: 'top-left'
    };
  }

  /**
   * Show tip toast
   * 
   * @param  {sting} title
   * @param  {string|undefined} message
   * @param  {bottom-right|bottom-left|top-right|top-left|undefined} position
   * @return {void}
   */
  static tip(...args) {
    this.notifier.apply(this, [ 'tip', ...this.expandArgument.apply(this, args) ]);
  }

  /**
   * Show info toast
   * 
   * @param  {sting} title
   * @param  {string|undefined} message
   * @param  {bottom-right|bottom-left|top-right|top-left|undefined} position
   * @return {void}
   */
  static info(...args) {
    this.notifier.apply(this, [ 'info', ...this.expandArgument.apply(this, args) ]);
  }

  /**
   * Show success toast
   * 
   * @param  {sting} title
   * @param  {string|undefined} message
   * @param  {bottom-right|bottom-left|top-right|top-left|undefined} position
   * @return {void}
   */
  static success(...args) {
    this.notifier.apply(this, [ 'success', ...this.expandArgument.apply(this, args) ]);
  }

  /**
   * Show warning toast
   * 
   * @param  {sting} title
   * @param  {string|undefined} message
   * @param  {bottom-right|bottom-left|top-right|top-left|undefined} position
   * @return {void}
   */
  static warning(...args) {
    this.notifier.apply(this, [ 'warning', ...this.expandArgument.apply(this, args) ]);
  }

  /**
   * Show alert toast
   * 
   * @param  {sting} title
   * @param  {string} message
   * @param  {bottom-right|bottom-left|top-right|top-left} position
   * @return {void}
   */
  static alert(...args) {
    this.notifier.apply(this, [ 'alert', ...this.expandArgument.apply(this, args) ]);
  }

  /**
   * Show toast
   * 
   * @param  {tip|info|success|warning|alert} type
   * @param  {string} title
   * @param  {string} message
   * @param  {bottom-right|bottom-left|top-right|top-left} position
   * @return {void}
   */
  static notifier(type, title, message, position = 'bottom-right') {
    if (!this._notifier) this._notifier = new AWN();
    const labels = {};
    labels[type] = title;
    if (!this._container) {
      this._container = document.querySelector('#awn-toast-container');
    } else {
      this._container.classList.remove('awn-bottom-right', 'awn-bottom-left', 'awn-top-right', 'awn-top-left');
      this._container.classList.add(`awn-${position}`);
    }
    const option = { labels, position };
    if (type === 'tip') option.icons = { enabled: false };
    this._notifier[type](message, option);
  }

  /**
   * Expand argument
   * 
   * @param  {sting} title
   * @param  {string|undefined} message
   * @param  {bottom-right|bottom-left|top-right|top-left|undefined} position
   * @return {string[]}
   */
  static expandArgument(...args) {
    let title = '', message, position = this.position.BOTTOM_RIGHT;
    if (args.length === 1) {
      message = args[0];
    } else if (args.length === 2) {
      if (args[1] === this.position.BOTTOM_RIGHT 
        || args[1] === this.position.BOTTOM_LEFT 
        || args[1] === this.position.TOP_RIGHT 
        || args[1] === this.position.TOP_LEFT) {
        [ message, position ] = args;
      } else {
        [ title, message] = args;
      }
    } else if (args.length === 3) {
      [ title, message, position] = args;
    } else {
      throw new Error('Invalid argument');
    }
    return [ title, message, position ];
  }
}