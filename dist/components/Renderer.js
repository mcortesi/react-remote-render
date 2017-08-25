"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { components: [] };
        _this.mappings = props.components.reduce(function (acc, component) {
            acc[component.externalName] = component;
            return acc;
        }, {});
        _this.proxyHandler = {
            onComponentMount: function (id, name, props) {
                _this.setState(function (prevState) { return ({
                    components: prevState.components.concat([{ id: id, name: name, props: props }])
                }); });
            },
            onUpdateComponent: function (id, props) {
                _this.setState(function (prevState) { return ({
                    components: prevState.components.map(function (cState) {
                        if (cState.id === id) {
                            return { id: id, name: cState.name, props: props };
                        }
                        else {
                            return cState;
                        }
                    })
                }); });
            },
            onUnmountComponent: function (id) {
                _this.setState(function (prevState) { return ({
                    components: prevState.components.filter(function (cState) { return cState.id === id; })
                }); });
            }
        };
        _this.props.server.registerHandler(_this.proxyHandler);
        return _this;
    }
    Renderer.prototype.componentWillUnmount = function () {
        this.props.server.unregisterHandler(this.proxyHandler);
    };
    Renderer.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null, this.state.components.map(function (_a) {
            var id = _a.id, name = _a.name, props = _a.props;
            var ExternalizedComponent = _this.mappings[name];
            var Component = ExternalizedComponent.WrappedComponent;
            return React.createElement(Component, __assign({ key: id }, ExternalizedComponent.deserializeProps(props)));
        })));
    };
    return Renderer;
}(React.PureComponent));
exports.default = Renderer;
//# sourceMappingURL=Renderer.js.map