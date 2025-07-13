class EmitterService {
  events = {};

  $emit(event, ...args) {
    (this.events[event] || []).forEach(i => i(...args));
  };

  $on(event, cb) {
    (this.events[event] = this.events[event] || []).push(cb);
  };

  $removeListeners() {
    this.events = {};
  };
};

export default EmitterService;