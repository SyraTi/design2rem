(function() {
    var elHTML = document.getElementsByTagName('html')[0]
    window.REM = {
        remSize: undefined, // Px value of 1rem
        maxRem: elHTML.getAttribute('rem:max-rem')||undefined,
        mode: elHTML.getAttribute('rem:mode')||'both',
        designRootPx: elHTML.getAttribute('rem:root-px')||100,
        designW: elHTML.getAttribute('rem:design-w')||undefined,
        designH: elHTML.getAttribute('rem:design-h')||undefined,
        /**
         * 初始化
         */
        init:function(){
            REM.resizeCssRemRoot()
            window.addEventListener('resize', function () {
                REM.resizeCssRemRoot()
            })
        },
        /**
         * 计算html字号 用于rem响应
         */
        resizeCssRemRoot: function () {
            try {
                var winW = (window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth)
                var winH = (window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight)
                var scaleW = winW / this.designW
                var scaleH = winH / this.designH
                var scale
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
                var remPx = scale * this.designRootPx
                this.remSize = this.maxRem ? (remPx <= this.maxRem ? remPx : this.maxRem) : remPx
                // 设定分辨率下的html字号
                elHTML.style.fontSize = this.remSize + 'px'
                var remCloaks = document.querySelectorAll('[rem-cloak]')
                for (var i = 0; i < remCloaks.length; i++) {
                    remCloaks[i].removeAttribute('rem-cloak')
                }
            } catch (e) {
                setTimeout(function () {
                    REM.resizeCssRemRoot()
                }, 500)
            }
        }
    };
    (function () {
        var valW = REM.designW
        var valH = REM.designH
        var valDesignRootPx = REM.designRootPx
        Object.defineProperties(REM, {
            designRootPx: {
                set: function (val) {
                    valDesignRootPx = val
                    this.resizeCssRemRoot()
                },
                get:function () {
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
            }
        })
    })()
    REM.init()
})()

