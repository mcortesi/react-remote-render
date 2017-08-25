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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var utils_1 = require("../utils");
var getDisplayName = function (Component) {
    if (typeof Component === 'string') {
        return Component;
    }
    if (!Component) {
        return undefined;
    }
    return Component.displayName || Component.name || 'Component';
};
/**
 * Creates an Remote Render Component.
 * This means the component won't render itself where it's mounted, but instead it will be rendered elsewhere in a <Renderer/>.
 * The renderer is probably in a different iframe/frame/process/browser/etc.
 *
 * Some important considerations for this to work:
 *  * All props must be "serializable" with JSON.stringify. if not, define pass customSerializers to make it so
 *  * Props that are functions, will be replaced so to work "on the wire". They are restricted. All parameters they receive
 *    MUST be serializable. Function return type must be *void*.
 *  * Since children prop is not serializable, is not supported. So, only works with component with no children prop.
 *
 */
function withRemoteRender(options) {
    var serializer = options.customSerializers == null ? function (p) { return p; } :
        function (props) { return utils_1.mapObject(props, function (value, key) {
            if (options.customSerializers[key]) {
                return options.customSerializers[key].serialize(value);
            }
            else {
                return value;
            }
        }); };
    var deserializer = options.customSerializers == null ? function (p) { return p; } :
        function (props) { return utils_1.mapObject(props, function (value, key) {
            if (options.customSerializers[key]) {
                return options.customSerializers[key].deserialize(value);
            }
            else {
                return value;
            }
        }); };
    return function (Component) {
        var externalName = (options.name || getDisplayName(Component));
        if (externalName == null) {
            throw new Error('Need an external name for externalized component');
        }
        var ExternalizedComponent = (function (_super) {
            __extends(ExternalizedComponent, _super);
            function ExternalizedComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ExternalizedComponent.prototype.componentDidMount = function () {
                if (this.context.remoteProxy) {
                    this.id = this.context.remoteProxy.mountComponent(externalName, serializer(this.props));
                }
            };
            ExternalizedComponent.prototype.componentDidUpdate = function () {
                if (this.context.remoteProxy) {
                    this.context.remoteProxy.updateComponent(this.id, serializer(this.props));
                }
            };
            ExternalizedComponent.prototype.componentWillUnmount = function () {
                if (this.context.remoteProxy) {
                    this.context.remoteProxy.unmountComponent(this.id);
                }
            };
            ExternalizedComponent.prototype.render = function () {
                return null;
            };
            ExternalizedComponent.WrappedComponent = Component;
            ExternalizedComponent.externalName = externalName;
            ExternalizedComponent.serializeProps = serializer;
            ExternalizedComponent.deserializeProps = deserializer;
            ExternalizedComponent.contextTypes = {
                remoteProxy: PropTypes.object
            };
            return ExternalizedComponent;
        }(React.PureComponent));
        ExternalizedComponent.displayName = "Externalized(" + getDisplayName(Component) + ")";
        return ExternalizedComponent;
    };
}
exports.default = withRemoteRender;
//# sourceMappingURL=withRemoteRender.js.map