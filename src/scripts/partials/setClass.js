
    const setClass = (el) => {

        if (typeof el._app.original_classes == 'undefined'){
            el._app.original_classes = el.className+''
        } else {
            el.className = el._app.original_classes
        }

        let new_class = new Evaluate(el._app.class.exp).value(),
            result

        if (Array.isArray(new_class)){
            result = new_class[1]
            new_class = new_class[0]
        }

        if (new_class && result !== false){

            new_class = new_class.toString().split(/\s/)

            new_class.map((item)=>{
                el.classList.add(item)
            })

        } else {
            el.className = el._app.original_classes
        }

    }

    module.exports = setClass
