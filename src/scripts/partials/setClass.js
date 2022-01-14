
    const setClass = (el) => {

        if (typeof el._app.original_classes == 'undefined'){
            el._app.original_classes = el.className+''
        } else {
            el.className = el._app.original_classes
        }

        let new_class = new Evaluate(el._app.class.exp).value()

        if (Array.isArray(new_class)){

          //  new_class = new_class.toString().split(/\s/)

            new_class.map((item)=>{
                if (!el.classList.contains(item)){
                    el.classList.add(item)
                }
            })

        } else if (typeof new_class == 'string') {

            new_class = new_class.split(/\s|,/)

            new_class.map((item)=>{

                if (typeof item == 'string' && item.length > 0 && !el.classList.contains(item)){
                    el.classList.add(item)
                }
            })

        } else if (el._app.original_classes) {
            el.className = el._app.original_classes
        }

    }

    module.exports = setClass
