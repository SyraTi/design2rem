
;(function (_global, undef) {
    var elHTML = document.getElementsByTagName('html')[0]
    var D2REM = {
        remSize: undefined, // 当前1rem等于多少像素

        maxRem: elHTML.getAttribute('rem:max-rem') || undefined, // 1Rem等于最大像素

        mode: elHTML.getAttribute('rem:mode') || 'both', // 只用设计稿的宽还是只用设计稿的高还是都使用于计算
        designRootPx: elHTML.getAttribute('rem:root-px') || 100, // 1Rem等于设计稿多少像素
        designW: elHTML.getAttribute('rem:design-w') || undefined, // 设计稿宽度
        designH: elHTML.getAttribute('rem:design-h') || undefined, // 设计稿高度

        simulateMode: elHTML.getAttribute('rem:simulate-mode') || 'both', // 模拟宽还是模拟高 还是都模拟
        simulateW: elHTML.getAttribute('rem:simulate-w') || undefined, // 模拟屏幕宽度
        simulateH: elHTML.getAttribute('rem:simulate-h') || undefined, // 模拟屏幕高度
        onRemSizeChange: function (remSize) {
        },
        /**
         * 初始化
         */
        init: function () {
            D2REM.resizeCssRemRoot()
            window.addEventListener('resize', function () {
                D2REM.resizeCssRemRoot()
            })
        },
        /**
         * 更改配置
         * @param opts
         *  @param [opts.maxRem]  1Rem等于最大像素
         *  @param [opts.mode]  只用设计稿的宽还是只用设计稿的高还是都使用于计算
         *  @param [opts.designRootPx] 设计稿尺寸下1Rem等于多少像素
         *  @param [opts.designW] 设计稿宽度
         *  @param [opts.designH] 设计稿高度
         *  @param [opts.simulateMode] 模拟宽还是模拟高 还是都模拟
         *  @param [opts.simulateW] 模拟屏幕宽度
         *  @param [opts.simulateH] 模拟屏幕高度
         *  @param [opts.onRemSizeChange] REM变化回调
         */
        setOption: function (opts) {
            this.mode = opts.mode || this.mode // 只用设计稿的宽还是只用设计稿的高还是都使用于计算

            this.designRootPx = opts.designRootPx || this.designRootPx // 1Rem等于设计稿多少像素
            this.designW = opts.designW || this.designW // 设计稿宽度
            this.designH = opts.designH || this.designH // 设计稿高度
            this.maxRem = opts.maxRem || this.maxRem // 1Rem等于最大像素

            this.simulateMode = opts.simulateMode || this.simulateMode // 模拟宽还是模拟高 还是都模拟
            this.simulateW = opts.simulateW || this.simulateW // 模拟屏幕宽度
            this.simulateH = opts.simulateH || this.simulateH // 模拟屏幕高度

            this.onRemSizeChange = opts.onRemSizeChange || this.onRemSizeChange

        },
        /**
         * 计算html字号 用于rem响应
         */
        resizeCssRemRoot: function () {
            try {
                var winW = (window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth)
                var winH = (window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight)

                var scaleW, scaleH, scale, remPx
                // 如果启用了模拟
                if (this.simulateW || this.simulateH) {
                    // 展示在模拟尺寸下设计稿的大小
                    scaleW = winW / this.simulateW
                    scaleH = winH / this.simulateH
                    switch (this.simulateMode) {
                        case 'Honly':
                            scale = scaleH
                            break
                        case 'Wonly':
                            scale = scaleW
                            break
                        case 'both':
                        default:
                            scale = scaleH < scaleW ? scaleH : scaleW
                            break
                    }
                    remPx = scale * this.designRootPx
                }
                else {
                    // 将设计稿缩放到屏幕大小
                    scaleW = winW / this.designW
                    scaleH = winH / this.designH

                    switch (this.mode) {
                        case 'Honly':
                            scale = scaleH
                            break
                        case 'Wonly':
                            scale = scaleW
                            break
                        case 'both':
                        default:
                            scale = scaleH < scaleW ? scaleH : scaleW
                            break
                    }
                    remPx = scale * this.designRootPx
                }


                // 判断最大rem尺寸的限制
                this.remSize = (this.maxRem && remPx >= this.maxRem) ? this.maxRem : remPx
                // 设定分辨率下的html字号
                elHTML.style.fontSize = this.remSize + 'px'
                // 去除rem-clock
                var remCloaks = document.querySelectorAll('[rem-cloak]')
                for (var i = 0; i < remCloaks.length; i++) {
                    remCloaks[i].removeAttribute('rem-cloak')
                }
            } catch (e) {
                // 如果出错 再次尝试
                setTimeout(function () {
                    D2REM.resizeCssRemRoot()
                }, 500)
            }
        }
    };
    (function () {
        var valW = D2REM.designW
        var valH = D2REM.designH
        var valDesignRootPx = D2REM.designRootPx
        var valRemSize = D2REM.remSize
        var valSimulateW = D2REM.simulateW
        var valSimulateH = D2REM.simulateH
        Object.defineProperties(D2REM, {
            remSize: {
                set: function (val) {
                    valRemSize = val
                    typeof this.onRemSizeChange == 'function' &&
                    this.onRemSizeChange(valRemSize)

                    // 在html标签上触发一个remSizeChange事件
                    window.document.documentElement.dispatchEvent(new CustomEvent('remSizeChange',{
                        detail:valRemSize
                    }))
                },
                get: function () {
                    return valRemSize
                }
            },
            designRootPx: {
                set: function (val) {
                    valDesignRootPx = val
                    this.resizeCssRemRoot()
                },
                get: function () {
                    return valDesignRootPx
                }
            },
            designW: {
                set: function (val) {
                    valW = val
                    this.resizeCssRemRoot()
                },
                get: function () {
                    return valW
                }
            },
            designH: {
                set: function (val) {
                    valH = val
                    this.resizeCssRemRoot()
                },
                get: function () {
                    return valH
                }
            },
            simulateW: {
                set: function (val) {
                    valSimulateW = val
                    this.resizeCssRemRoot()
                },
                get: function () {
                    return valSimulateW
                }
            },
            simulateH: {
                set: function (val) {
                    valSimulateH = val
                    this.resizeCssRemRoot()
                },
                get: function () {
                    return valSimulateH
                }
            }
        })
    })()
    D2REM.init()
    // 最后将插件对象暴露给全局对象
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = D2REM
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return D2REM
        })
    } else {
        !('D2REM' in _global) && (_global.D2REM = D2REM)
    }
})((function () {
    return this || (0, eval)('this')
}()))
