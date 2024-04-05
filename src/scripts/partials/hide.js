
    const hide = (el, val) => {

        let result = new Evaluate(el._app.hide.exp).value()

        if (!el._app.hide.orig_display){ // init

            el._app.hide.orig_display = window.getComputedStyle(el, null).display

            if (el._app.hide.orig_display == 'none'){
                if (el.classList.contains('flex')){
                    el._app.hide.orig_display = 'flex'
                } else if (el.classList.contains('inline-flex')){
                    el._app.hide.orig_display = 'inline-flex'
                } else if (el.classList.contains('inline-block')){
                    el._app.hide.orig_display = 'inline-block'
                } else if (el.classList.contains('inline')){
                    el._app.hide.orig_display = 'inline'
                } else {
                    el._app.hide.orig_display = 'block'
                }
            }

            if (el.tagName == 'MODAL-AUTO'){
                el._app.show.orig_display = 'flex'
            }

            if (result && result != false){
                el.style.display = 'none'
            } else {
                el.style.display = el._app.hide.orig_display
            }

        } else {

            if (result && result != false){
                view.exitView(el)
            } else {
                view.enterView(el)
            }

        }

    }

    export default hide
