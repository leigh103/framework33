const longpress = (evt, click) => {

    if (scope.view._click_enabled === true){
        return false
    } else {
        scope.view._click_enabled = true
    }

    let el = evt.target,
        right_click = false

    if (typeof evt.stopPropagation == 'function'){
        evt.stopPropagation()
    }

    if (el && !el._app || el && el._app && !el._app.click){
        el = el.parentNode
        evt._parentNode = el
    }

    if (el && !el._app || el && el._app && !el._app.click){
        el = el.parentNode
        evt._parentNode = el
    }

    if (click && click == 'click'){

        clearTimeout(el._app.timer)

        if (el && el._app && el._app.longpress && el._app.longpress.exp){
            new Evaluate(el._app.longpress.exp).value(evt)
        }
    
    } else if (evt.type == 'contextmenu' && evt.button == 2){

        evt.preventDefault()

        if (el && el._app && el._app.longpress && el._app.longpress.exp){
            new Evaluate(el._app.longpress.exp).value(evt)
        }
        
    } else if (evt.type == 'touchstart'){

        el._app.timer = setTimeout(function(){
         //   console.log(evt)
            longpress(evt,'click')
        },2000)


    } else if (evt.type == 'touchend'){

        clearTimeout(el._app.timer)
        console.log('stop')
    }

    scope.view._click_enabled = false

}

module.exports = longpress
