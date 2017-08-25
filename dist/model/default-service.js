"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messages_1 = require("../types/messages");
var utils_1 = require("../utils");
var DefaultRemoteRenderClient = (function () {
    function DefaultRemoteRenderClient(transport) {
        var _this = this;
        this.nextId = 0;
        this.mountedComponents = new Map();
        this.transport = transport;
        this.transport.onServerMessage(function (msg) {
            _this.onRemoteFunctionCall(msg.id, msg.functionKey, msg.params);
        });
    }
    DefaultRemoteRenderClient.prototype.onRemoteFunctionCall = function (id, functionKey, params) {
        if (this.mountedComponents.has(id) && this.mountedComponents.get(id).has(functionKey)) {
            this.mountedComponents.get(id).get(functionKey).apply(void 0, params);
        }
        else {
            console.error("Tried to call unmounted/unexistent function component:" + id + " fn:" + functionKey);
        }
    };
    DefaultRemoteRenderClient.prototype.processProps = function (id, props) {
        var functionProps = [];
        var simpleProps = {};
        var savedFunctions = new Map();
        Object.keys(props).forEach(function (propKey) {
            if (typeof (props[propKey]) === 'function') {
                functionProps.push(propKey);
                savedFunctions.set(propKey, props[propKey]);
            }
            else {
                simpleProps[propKey] = props[propKey];
            }
        });
        this.mountedComponents.set(id, savedFunctions);
        return { simpleProps: simpleProps, functionProps: functionProps };
    };
    DefaultRemoteRenderClient.prototype.mountComponent = function (name, props) {
        var id = this.nextId++;
        this.transport.sendClientMessage({
            kind: messages_1.ClientMessageKind.Mount,
            id: id,
            name: name,
            props: this.processProps(id, props)
        });
        return id;
    };
    DefaultRemoteRenderClient.prototype.updateComponent = function (id, props) {
        this.transport.sendClientMessage({
            kind: messages_1.ClientMessageKind.Update,
            id: id,
            props: this.processProps(id, props)
        });
    };
    DefaultRemoteRenderClient.prototype.unmountComponent = function (id) {
        this.transport.sendClientMessage({
            kind: messages_1.ClientMessageKind.Unmount,
            id: id
        });
        this.mountedComponents.delete(id);
    };
    return DefaultRemoteRenderClient;
}());
exports.DefaultRemoteRenderClient = DefaultRemoteRenderClient;
var DefaultRemoteRenderServer = (function () {
    function DefaultRemoteRenderServer(transport) {
        var _this = this;
        this.handlers = [];
        this.onClientMessage = function (msg) {
            switch (msg.kind) {
                case messages_1.ClientMessageKind.Mount: {
                    var parsedProps_1 = _this.processProps(msg.id, msg.props);
                    _this.tellHandlers(function (h) {
                        return h.onComponentMount(msg.id, msg.name, parsedProps_1);
                    });
                    break;
                }
                case messages_1.ClientMessageKind.Update: {
                    var parsedProps_2 = _this.processProps(msg.id, msg.props);
                    _this.tellHandlers(function (h) {
                        return h.onUpdateComponent(msg.id, parsedProps_2);
                    });
                    break;
                }
                case messages_1.ClientMessageKind.Unmount: {
                    _this.tellHandlers(function (h) {
                        return h.onUnmountComponent(msg.id);
                    });
                    break;
                }
                default: {
                    throw new Error("unknown message kind " + msg);
                }
            }
        };
        this.transport = transport;
        this.transport.onClientMessage(this.onClientMessage);
    }
    DefaultRemoteRenderServer.prototype.registerHandler = function (listener) {
        this.handlers.push(listener);
    };
    DefaultRemoteRenderServer.prototype.unregisterHandler = function (listener) {
        this.handlers = this.handlers.filter(function (handler) { return handler !== listener; });
    };
    DefaultRemoteRenderServer.prototype.tellHandlers = function (f) {
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
    DefaultRemoteRenderServer.prototype.processProps = function (id, props) {
        var _this = this;
        var functionProxy = function (functionKey) { return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _this.transport.sendServerMessage({ id: id, functionKey: functionKey, params: params });
        }; };
        var functionProps = utils_1.fromPairs(props.functionProps.map(function (key) {
            return [key, functionProxy(key)];
        }));
        return Object.assign({}, props.simpleProps, functionProps);
    };
    return DefaultRemoteRenderServer;
}());
exports.DefaultRemoteRenderServer = DefaultRemoteRenderServer;
//# sourceMappingURL=default-service.js.map