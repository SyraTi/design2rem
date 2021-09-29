# design2rem

## Introduce 介绍
design2rem 是一个可以通过单个设计稿快速实现屏幕自适应的工具。

## Demo 直接看效果
[here](https://syrati.github.io/design2rem/demo/frame.html)

## How 如何实现
design2rem使用```rem```单位，根据窗口尺寸，动态计算```<html>```元素的```font-size```来实现对屏幕的自适应。

## Installation 安装

- using npm
```shell
npm install design2rem --save
```
then import in script
```javascript
import D2REM from 'design2rem'
```

- using ```<script>``` tag
```html
<script src="design2rem.js"></script>
```

## Quickstart 起步
html
```html
<!doctype html>
<!-- 
  说明:
     rem:design-w: 设计稿宽度
     rem:design-h: 设计稿高度
     rem:mode: 模式，both代表同时适配宽和高
-->
<html 
    rem:design-w="1920" 
    rem:design-h="1080" 
    rem:mode="both" ...otheroptions>
<head>
</head>
<body>
  <div class="container">
    <div class="sidebar"></div>
    <!-- ...contents-->
  </div>
</body>
</html>
```
css
```css
.container{
  /* 默认使用设计稿px尺寸/100作为rem尺寸 */
  width: 19.2rem;
  height: 10.8rem;
}
.sidebar{
  width: 3rem;
  height: 100%;
}
```

## Usage 使用
### Config 配置
design2rem以下提供两种方式的配置：
- use```rem:```properties: 使用```rem:```属性，此方式可以用于配置的初始化。
```html
<!doctype html>
<html rem:design-w="750" rem:design-h="750">
<head>
</head>
<body>
  <div class="container">
    <div class="sidebar"></div>
    <!-- ...contents-->
  </div>
</body>
</html>
```
- use```setOption```: 使用```setOption```，可以实现初始化以及动态修改配置。
```javascript
D2REM.setOption({
  // 设计稿的宽度，默认为空
  designW: 1920,
  // 设计稿的高度，默认为空
  designH: 1080,
  // 适配模式，默认值'both'
  // 'both': 同时适配宽和高，此时以窗口的宽和高的较短方为适配目标，适用场景：满屏无滚动条页面
  // 'width': 只适配宽，此时无论窗口高度如何变化，都不会对页面产生影响，适用场景：纵向滚动长页面
  // 'height': 只适配搞，此时无论窗口宽度如何变化，都不会对页面产生影响，适用场景；横向滚动长页面
  mode: 'both',
  // 1Rem等于设计稿多少像素，默认为100， 即1Rem = 设计稿100px
  designRootPx: 100,
  // 最大<html>像素，默认为空
  maxRem: 100,
  // 模拟模式，默认为空，当此值存在时，可以模拟当前窗口的大小，用来查看目标窗口尺寸下的效果
  simulateMode: 'both',
  // 模拟窗口的尺寸，默认为空，模拟模式适合在开发大型屏幕，或者超出当前开发环境使用的屏幕大小的页面时使用，查看目标尺寸下的效果非常方便
  simulateW:19200,
  simulateH:10800,
  // 当rem值对应的px值发生改变时会触发的回调， 注意：此项只能通过setOption，而不能通过rem properties的方式设置
  onRemSizeChange:function (){}
})
```


