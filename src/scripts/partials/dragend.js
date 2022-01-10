
    const dragend = (evt) => {

        if (scope.view._click_enabled === true){
            return false
        } else {
            scope.view._drag_enabled = true
        }


        let el = evt.target

        if (typeof evt.stopPropagation == 'function'){
            evt.stopPropagation()
        }

        if (el && !el._app || el && el._app && !el._app.drag){
            el = el.parentNode
            evt._parentNode = el
        }

        if (el && !el._app || el && el._app && !el._app.drag){
            el = el.parentNode
            evt._parentNode = el
        }

        if (el && el._app && el._app.drag && el._app.drag.exp){
            new Evaluate(el._app.drag.exp).value(evt)
        }
        scope.view._drag_enabled = false

    }

    module.exports = dragend
