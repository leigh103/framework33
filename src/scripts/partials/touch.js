const touch = (evt) => {


    if (scope.view._click_enabled === true){
        return false
    } else {
        scope.view._click_enabled = true
    }

    let el = evt.target,
        longpress = false

    if (typeof evt.stopPropagation == 'function'){
        evt.stopPropagation()
        evt.preventDefault()
    }

    if (el && !el._app || el && el._app && !el._app.click){
        el = el.parentNode
        evt._parentNode = el
    }

    if (el && !el._app || el && el._app && !el._app.click){
        el = el.parentNode
        evt._parentNode = el
    }

    if (evt.type == 'touchstart' && el && el._app && el._app.longpress && el._app.longpress.exp){

        el._app.click_timer = Date.now()
        el.classList.remove('touchstart')
        el.classList.add('touchstart')

    }
    console.log(evt.type, longpress)
    if (evt.type == 'touchend'){

        if (evt.type == 'touchend' && el && el._app && el._app.longpress && el._app.longpress.exp){
            el.classList.remove('touchstart')
            el.classList.add('touchend')
            longpress = Date.now() - el._app.click_timer > 1000 ? true : false
        }
        console.log(evt.type, longpress)
        if (longpress === false && el && el._app && el._app.click && el._app.click.exp){
            new Evaluate(el._app.click.exp).value(evt)
        } else if (longpress === true && el && el._app && el._app.longpress && el._app.longpress.exp){
            new Evaluate(el._app.longpress.exp).value(evt)
        }

    }

    scope.view._click_enabled = false

}

module.exports = touch
