const hover = (evt) => {

    if (scope.view._click_enabled === true){
        return false
    } else {
        scope.view._click_enabled = true
    }


    let el = evt.target

    if (typeof evt.stopPropagation == 'function'){
        evt.stopPropagation()
    }

    if (el && !el._app || el && el._app && !el._app.hover){
        el = el.parentNode
        evt._parentNode = el
    }

    if (el && !el._app || el && el._app && !el._app.hover){
        el = el.parentNode
        evt._parentNode = el
    }

    if (el && el._app && el._app.hover && el._app.hover.exp){
        new Evaluate(el._app.hover.exp).value(evt)
    }
    scope.view._click_enabled = false

}

module.exports = hover
