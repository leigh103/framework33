
    const show = (el, val) => {
     //   console.log(el, val)
        let result = new Evaluate(el._app.show.exp).value()

        if (!el._app.show.orig_display){ // init

            el._app.show.orig_display = window.getComputedStyle(el, null).display
        //    console.log(el, el._app.show.orig_display)
            if (el._app.show.orig_display == 'none'){

                if (el.classList.contains('flex')){
                    el._app.show.orig_display = 'flex'
                } else if (el.classList.contains('inline-flex')){
                    el._app.show.orig_display = 'inline-flex'
                } else if (el.classList.contains('inline-block')){
                    el._app.show.orig_display = 'inline-block'
                } else if (el.classList.contains('inline')){
                    el._app.show.orig_display = 'inline'
                } else {
                    el._app.show.orig_display = 'block'
                }

            }

        }
// console.log(el, val, result)
        if (result && result != false){
            view.enterView(el)
        } else {
            view.exitView(el)
        }

    }

    export default show
