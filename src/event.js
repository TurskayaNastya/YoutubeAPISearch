var mixin = {};

mixin.on = function (event, callback) {
  this._events = this._events || {};

  if (typeof event === 'string') {
    return (this._events[event] = this._events[event] || []).push(callback);
  }

  for (let name in event) {
    event.hasOwnProperty(name) && this.on(name, event[name]);
  }
};

mixin.off = function (name, callback) {
  if (!arguments.length) return delete this._events;

  if (!this._events || !this._events[name]) return;

  if (arguments.length === 1) return delete this._events[name];

  var idx = this._events[name].indexOf(callback);

  idx !== -1 && this._events[name].splice(idx, 1);
};

mixin.trigger = function (name) {
  if (!this._events || !this._events[name]) return;

  var params = Array.prototype.slice.call(arguments, 1);

  for (let i = 0, len = this._events[name].length; i < len; i++) {
    this._events[name][i].apply(this, params);
  }
};

export default function (target) {
    for (let name in mixin) {
        if (mixin.hasOwnProperty(name)) {
            (target[name] = mixin[name]);
        }
    }

    return target;
};
