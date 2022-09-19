class GenOptimizer {
    constructor(runCallback) {
        this.runCallback = runCallback
        window.fps = 10
        this.setup()
    }

    static instance(...args) {
        this.i = this.i || new this(...args)
        return this.i
    }

    setup() {
        // canvas
        this.canvas = document.querySelector("#id-canvas")
        this.context = this.canvas.getContext('2d')
        // 
        this.scene = null
        // image and upload
        this.images = []
        this.bindUploadEvents()
        //
        this.mouseActions = []
        this.setupMouse()
    }
    
    setupMouse() {
        let self = this
        let moving = false
        this.canvas.addEventListener('mousedown', event => {
            moving = true
            for (const a of self.mouseActions) {
                a(event, 'down')
            }
        })
        this.canvas.addEventListener('mousemove', event => {
            if (moving) {
                for (const a of self.mouseActions) {
                    a(event, 'move')
                }
            }
        })
        this.canvas.addEventListener('mouseup', event => {
            moving = false
            for (const a of self.mouseActions) {
                a(event, 'up')
            }
        })
        this.canvas.addEventListener('mouseout', event => {
            moving = false
            for (const a of self.mouseActions) {
                a(event, 'out')
            }
        })
        this.canvas.addEventListener('mouseleave', event => {
            moving = false
            for (const a of self.mouseActions) {
                a(event, 'leave')
            }
        })
    }
    
    resgisterMouse(callback) {
        this.mouseActions.push(callback)
    }

    runWithScene(scene) {
        var self = this
        this.scene = scene
        // log("runwitdh", this)
        // 开始运行程序
        setTimeout(function(){
            self.runloop()
        }, 1000 / window.fps)
    }

    draw() {
        this.scene.draw()
    }

    update() {
        this.scene.update()
    }

    runloop() {
        // log(window.fps)
        // events
        var g = this
        // update
        g.update()
        // clear
        g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)
        // draw
        g.draw()
        // next run loop
        setTimeout(function(){
            g.runloop()
        }, 1000 / window.fps)
    }

    __start() {
        this.runCallback(this)
    }

    bindUploadEvents() {
        var self = this
        var dp = e('#id-div-uploader')
    
        dp.addEventListener('dragover', function (e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        })
    
        dp.addEventListener("drop", function (e) {
            e.stopPropagation()
            e.preventDefault()
            let files = Object.values(e.dataTransfer.files).filter(
                f => f.type.includes("image")
            )
            for (var file of files) {
                var reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let img = new Image()
                    img.src = e.target.result
                    img.onload = function() { 
                        self.images.push(img)
                        if (self.images.length == files.length) {
                            log("__start")
                            self.__start()
                        }
                    }
                }
            }
        })
    }

}