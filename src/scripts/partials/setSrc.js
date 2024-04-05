
    const setSrc = (el) => {

        if (typeof el._app.original_src == 'undefined'){
            el._app.original_src = el.src+''
        }

        let new_src = new Evaluate(el._app.src.exp).value()

        if (new_src && typeof new_src == 'object'){

            if (new_src.thumbnail){
                new_src = new_src.thumbnail
            }
            
        }

        if (new_src){
            el.src = new_src
        } else if (el._app.original_src) {
            el.src = el._app.original_src
        }
        

    }

    module.exports = setSrc
