import $ from 'jquery';

export default class {
  constructor() {
    this.listeners = {
      beforeSend: () => {},
      progress: () => {}
    };
  }

  on(type, listener) {
    this.listeners[type] = listener;
    return this;
  }

  get endpoint() {
    return 'Resource name';
  }

  get(id) {
    const path = id;
    return this.request({ path });
  }

  post(data) {
    return this.request({ type: 'POST', data });
  }

  put(id, data, path = null) {
    path = path ? `${path.replace(/^\/|\/$/g, '')}/${id}` : id;
    return this.request({ type: 'PUT', path, data });
  }

  delete(id) {
    return this.request({ type: 'DELETE', path: id });
  }

  query(data) {
    return this.request({ data });
  }

  request({ type = 'GET', path = null, data = null } = {}) {
    let url = this.endpoint;
    if (path) url += `/${path.toString().replace(/^\//, '')}`;
    let option = {
      type,
      data,
      crossDomain: true,
      xhrFields: { withCredentials: true },
      xhr: () => {
        const xhr = new XMLHttpRequest();
        let befored = false;
        xhr.upload.addEventListener('progress', event => {
          if (!event.lengthComputable) return;
          if (!befored) {
            this.listeners.beforeSend(event.total);
            befored = true;
          }
          this.listeners.progress(event.loaded, event.total);
        });
        return xhr;
      }
    };
    if (data && data.constructor == FormData) Object.assign(option, { processData: false, contentType: false });
    return $.ajax(url, option);
  }
}