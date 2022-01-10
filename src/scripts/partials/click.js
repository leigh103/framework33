
    const click = (evt) => {

        if (scope.view._click_enabled === true){
            return false
        } else {
            scope.view._click_enabled = true
        }


        let el = evt.target

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

        if (el && el._app && el._app.click && el._app.click.exp){
            new Evaluate(el._app.click.exp).value(evt)
        }
        scope.view._click_enabled = false

    }

    module.exports = click
