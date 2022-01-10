
    const paste = (evt) => {

        let el = evt.target

        if (el && el._app && el._app.model && el._app.model.exp){

            setTimeout(function(){
                if (el.hasAttribute('data-keep-format')){
                    evaluate.setValue(el._app.model.exp, el.innerHTML)
                } else {
                    el.innerHTML = el.innerText
                    evaluate.setValue(el._app.model.exp, el.innerText)
                }
            },100)


        }


    }

    module.exports = paste
