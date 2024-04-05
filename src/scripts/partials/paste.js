
    const paste = (evt) => {

        let el = evt.target

        if (el && el._app && el._app.model && el._app.model.exp){
console.log(el.tagName)
            setTimeout(function(){
                if (el.hasAttribute('data-keep-format')){
                    evaluate.setValue(el._app.model.exp, el.innerHTML)
                } else if (el.tagName == "TEXTAREA") {
                    evaluate.setValue(el._app.model.exp, el.value)
                } else {
                    el.innerHTML = el.innerText
                    evaluate.setValue(el._app.model.exp, el.innerText)
                }
            },100)


        }


    }

    module.exports = paste
