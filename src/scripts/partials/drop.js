
    const drop = (evt) => {

        if (scope.view._drop_enabled === true){
            return false
        } else {
            scope.view._drop_enabled = true
        }


        let el = evt.target

        if (typeof evt.stopPropagation == 'function'){
            evt.stopPropagation()
        }

        if (el && !el._app || el && el._app && !el._app.drop){
            el = el.parentNode
            evt._parentNode = el
        }

        if (el && !el._app || el && el._app && !el._app.drop){
            el = el.parentNode
            evt._parentNode = el
        }

        if (el && el._app && el._app.drop && el._app.drop.exp){
            new Evaluate(el._app.drop.exp).value(evt)
        }
        scope.view._drop_enabled = false

    }

    module.exports = drop
