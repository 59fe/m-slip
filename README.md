# m-slip 滑片组件

---

## 何时使用

侧边栏、操作表、Popup等等很多场景。可以指定滑入的距离、方向

## API

| 参数       |说明           | 类型            |可选值| 默认值       |
|------------|----------------|-------------|------|--------|
| content        | 滑块内容，必填|react元素		| |无			| 
| titleCenter        | 标题释放居中			| boolean|           | true
| hasHeader       | 是否有头部结构	| boolean		|	| true
| hasCross       | 右上角的叉图标。规则是：如果depth是'100',默认有叉；否则默认没有叉。在这个前提上，如果调用者手动传入了hasCross为true或false,则忽略对depth的判断依赖	| 	boolean	|	| undefined
| depth      | 片滑入的深度占方向总宽（或高）的百分比值 | string| 	默认是100（即100%,全屏）,0~100都可以		  | '100'
| dir             |滑块进入方向|           string  | 'top', 'bottom', 'left', 'right'|'bottom'|
| onOpen      | 滑块打开时的回调| funtion | |noop|
| onOpened   | 滑块打开动画完成后的回调 			| funtion  |  |noop|
| onClose | 滑块关闭时的回调          | funtion   |  |noop|
| onClosed | 滑块关闭动画完成后的回调          | funtion|        |noop|


## 静态方法

### Slip.hide()

比如：Slip.hide(3000)

| 参数       |说明           | 类型            |可选值| 默认值       |
|------------|----------------|-------------|------|--------|
| delaytime  | 可选，延时多少毫秒后关闭当前的Slip | number | |无			| 
