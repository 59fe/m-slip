'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _getTransitionEnd = require('m-base/js/getTransitionEnd');

var _getTransitionEnd2 = _interopRequireDefault(_getTransitionEnd);

var _triggerM = require('r-trigger');

var _triggerM2 = _interopRequireDefault(_triggerM);

var _maskM = require('m-mask');

var _maskM2 = _interopRequireDefault(_maskM);

var _util = require('m-base/js/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

function noop() {
    return true;
}

var Slip = function (_React$Component) {
    _inherits(Slip, _React$Component);

    function Slip(props) {
        _classCallCheck(this, Slip);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.state = {
            // opened在Slip滑入滑出动画执行完毕后才会更新。
            opened: false,
            // 非关闭流程时，open都是true
            open: false,
            transitionStart: false
        };
        _this.id = _util2.default.createComponentId();
        return _this;
    }
    // Slip 组件滑入滑出动画执行完毕后的回调


    Slip.prototype.handleSlipTransition = function handleSlipTransition(e) {
        if (e.propertyName != 'transform') return;
        var ifNowOpened = this.state.opened;

        // callback trigger
        if (ifNowOpened) {
            this.props.onClosed.call(this);
        } else {
            this.props.onOpened.call(this);
        }
        this.setState({
            transitionStart: false,
            opened: !ifNowOpened
        });
    };
    // React Slip reRender 逻辑


    Slip.prototype.renderSlip = function renderSlip() {
        var props = this.props,
            state = this.state,
            ifNowOpened = state.opened,
            ifTransitionStart = state.transitionStart,
            slipCls = (0, _classnames2.default)('slip', {
            "show": ifTransitionStart,
            "dialog-in": state.open,
            "dialog-out": ifTransitionStart && ifNowOpened
        }, this.dirCls),
            slipStyle = state.open ? this.slipStyle : {},
            slipOverlayCls = (0, _classnames2.default)({
            "dialog-overlay-visible": ifTransitionStart && !ifNowOpened
        }),

        // 右上角的叉图标。规则是：如果depth是'100',默认有叉；否则默认没有叉。在这个前提上，如果调用者手动传入了hasCross为true或false,则忽略对depth的判断依赖
        hasCross = props.hasCross === undefined ? props.depth == '100' : props.hasCross;

        if (state.open) {
            this.props.onOpen.call(this);
        } else if (ifTransitionStart && ifNowOpened) {
            this.props.onClose.call(this);
        }
        _reactDom2.default.render(_react2.default.createElement(
            'div',
            { className: 'slip-wrap' },
            _react2.default.createElement(
                'div',
                { className: slipCls, id: this.id, onTouchTap: this.handleSlipClick.bind(this), style: slipStyle },
                props.hasHeader ? _react2.default.createElement(
                    'header',
                    { className: this.slipTitleCls },
                    hasCross ? _react2.default.createElement('i', { className: 'close-slip' }, '&times;') : false,
                    _react2.default.createElement(
                        'h2',
                        null,
                        props.title
                    )
                ) : false,
                _react2.default.createElement(
                    'div',
                    { className: 'slip-content' },
                    props.content
                )
            ),
            _react2.default.createElement(_maskM2.default, { className: slipOverlayCls, onClick: this.handleClick.bind(this) })
        ), this.con);
    };

    // 生成一些在生命周期里都固定的DOM属性,只执行一次


    Slip.prototype.buildStaticStyle = function buildStaticStyle() {
        var props = this.props,
            dir = props.dir,
            depth = props.depth;
        this.dirCls = dir != 'bottom' && 'dir-' + dir;
        this.slipTitleCls = (0, _classnames2.default)('slip-title', {
            "text-center": props.titleCenter
        });
        this.slipStyle = {};
        // 非全屏的Slip逻辑（Action、侧边栏及各类变种）
        if (depth != '100') {
            var restDepth = 100 - depth,
                restPercent = restDepth / 100,
                client = document.documentElement;
            var translateMap = {
                bottom: '0, ' + restDepth + '%, 0',
                top: '0, -' + restDepth + '%, 0',
                left: '-' + restDepth + '%, 0, 0',
                right: restDepth + '%, 0, 0'
            },
                dirSuffixMap = {
                bottom: 'Bottom',
                top: 'Top',
                left: 'Left',
                right: 'Right'
            },
                paddingMap = {
                bottom: client.clientHeight * restPercent,
                top: client.clientHeight * restPercent,
                left: client.clientWidth * restPercent,
                right: client.clientWidth * restPercent
            };
            this.slipStyle.transform = 'translate3d(' + translateMap[dir] + ')';
            //TODO paddingxxx的值，正负判断,100% - translate 值
            this.slipStyle['padding' + dirSuffixMap[dir]] = paddingMap[dir];
        }
    };

    Slip.prototype.componentWillUnmount = function componentWillUnmount() {
        var slip = document.getElementById(this.id),
            slipCon = document.getElementById(this.conid);
        // 路由或其他原因导致组件unmount时，卸载组件DOM
        slip.removeEventListener(_getTransitionEnd2.default, this.handleSlipTransition, true);
        slipCon.parentNode.removeChild(slipCon);
    };

    Slip.prototype.componentDidMount = function componentDidMount() {
        var con = document.createElement('div'),
            conid = '_slip_container_' + _util2.default.createRandomStamp();
        this.conid = con.id = conid;
        document.body.appendChild(con);
        this.con = con;

        this.buildStaticStyle();
        this.renderSlip();

        var slip = document.getElementById(this.id);
        slip.addEventListener(_getTransitionEnd2.default, this.handleSlipTransition.bind(this), true);
    };

    Slip.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        if (!nextState.transitionStart && nextState.open) {
            return false;
        } else {
            return true;
        }
    };

    Slip.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        this.renderSlip();
    };

    Slip.prototype.handleSlipClick = function handleSlipClick(e) {
        if (/close-slip/.test(e.target.className)) {
            this.handleClick();
        }
    };

    Slip.prototype.handleClick = function handleClick() {
        var opened = this.state.opened,
            slip = document.getElementById(this.id),
            that = this;
        slip.classList.add('show');

        setTimeout(function () {
            that.setState({
                open: !opened,
                transitionStart: true
            });
        }, 16);
    };

    Slip.prototype.render = function render() {
        return _react2.default.createElement(
            _triggerM2.default,
            { onTouchTap: this.handleClick.bind(this) },
            this.props.children
        );
    };

    return Slip;
}(_react2.default.Component);

Slip.hide = function () {
    var delaytime = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    var slip = document.querySelector('.show.slip');
    var slipMask = document.querySelector('.show.slip + .mask');
    setTimeout(function () {
        // 如果此时Slip已经被关闭了，则不处理
        if (slip.classList.contains('show')) {
            slipMask.click();
        }
    }, delaytime);
};

Slip.propTypes = {
    content: _react.PropTypes.element.isRequired,
    titleCenter: _react.PropTypes.bool,
    hasHeader: _react.PropTypes.bool,
    depth: function depth(props, propName, componentName) {
        var val = props[propName];
        if (isNaN(+val)) return new Error('depth参数"' + val + '"错误：请传入合法的数字字符串');
        if (+val > 100 || +val < 0) {
            return new Error('depth参数"' + val + '"错误：参数为百分比值，请保证在0~100区间');
        }
    },
    dir: _react.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    onOpen: _react.PropTypes.func,
    onOpened: _react.PropTypes.func,
    onClose: _react.PropTypes.func,
    onClosed: _react.PropTypes.func
};
Slip.defaultProps = {
    // 标题是否要居中
    titleCenter: true,
    depth: '100', //滑片滑入的深度占方向总宽（或高）的百分比值，默认是100（即100%,全屏）,0~100都可以
    dir: 'bottom',
    // 右上角的叉图标。规则是：如果depth是'100',默认有叉；否则默认没有叉。在这个前提上，如果调用者手动传入了hasCross为true或false,则忽略对depth的判断依赖
    hasCross: undefined,
    hasHeader: true,
    onOpen: noop,
    onOpened: noop,
    onClose: noop,
    onClosed: noop
};

exports.default = Slip;
module.exports = exports['default'];
