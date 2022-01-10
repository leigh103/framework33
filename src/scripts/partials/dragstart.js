
    const dragstart = (evt) => {

        if (scope.view._dragstart_enabled === true){
            return false
        } else {
            scope.view._dragstart_enabled = true
        }


        let el = evt.target

        if (typeof evt.stopPropagation == 'function'){
            evt.stopPropagation()
        }

        if (el && !el._app || el && el._app && !el._app.dragstart){
            el = el.parentNode
            evt._parentNode = el
        }

        if (el && !el._app || el && el._app && !el._app.dragstart){
            el = el.parentNode
            evt._parentNode = el
        }

        if (el && el._app && el._app.dragstart && el._app.dragstart.exp){
            new Evaluate(el._app.dragstart.exp).value(evt)
        }
        scope.view._dragstart_enabled = false

    }

    module.exports = dragstart
