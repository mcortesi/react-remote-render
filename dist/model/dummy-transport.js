"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DummyTransport = (function () {
    function DummyTransport() {
        this.clientMessageHandlers = [];
        this.serverMessageHandlers = [];
    }
    DummyTransport.prototype.mimicTransport = function (value) {
        var asString = JSON.stringify(value);
        return JSON.parse(asString);
    };
    DummyTransport.prototype.sendClientMessage = function (msg) {
        var receievedMsg = this.mimicTransport(msg);
        this.clientMessageHandlers.forEach(function (handler) {
            handler(receievedMsg);
        });
    };
    DummyTransport.prototype.sendServerMessage = function (msg) {
        var receievedMsg = this.mimicTransport(msg);
        this.serverMessageHandlers.forEach(function (handler) {
            handler(receievedMsg);
        });
    };
    DummyTransport.prototype.onClientMessage = function (msgHandler) {
        this.clientMessageHandlers.push(msgHandler);
    };
    DummyTransport.prototype.onServerMessage = function (msgHandler) {
        this.serverMessageHandlers.push(msgHandler);
    };
    return DummyTransport;
}());
exports.default = DummyTransport;
//# sourceMappingURL=dummy-transport.js.map