"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DummyRemoteProxy = (function () {
    function DummyRemoteProxy() {
        this.handlers = [];
        this.nextId = 0;
    }
    DummyRemoteProxy.prototype.registerHandler = function (listener) {
        this.handlers.push(listener);
    };
    DummyRemoteProxy.prototype.unregisterHandler = function (listener) {
        this.handlers = this.handlers.filter(function (handler) { return handler !== listener; });
    };
    DummyRemoteProxy.prototype.tellHandlers = function (f) {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var h = _a[_i];
            try {
                f(h);
            }
            catch (err) {
                console.error(err);
                // continue
            }
        }
    };
    DummyRemoteProxy.prototype.mountComponent = function (name, props) {
        var id = this.nextId++;
        this.tellHandlers(function (h) { console.log('sending onComponentMount to', id); h.onComponentMount(id, name, props); });
        return id;
    };
    DummyRemoteProxy.prototype.updateComponent = function (id, props) {
        this.tellHandlers(function (h) { console.log('sending onUpdateComponent to', id); h.onUpdateComponent(id, props); });
    };
    DummyRemoteProxy.prototype.unmountComponent = function (id) {
        this.tellHandlers(function (h) { console.log('sending onUnmountComponent to', id); h.onUnmountComponent(id); });
    };
    return DummyRemoteProxy;
}());
exports.default = DummyRemoteProxy;
//# sourceMappingURL=dummy-service.js.map