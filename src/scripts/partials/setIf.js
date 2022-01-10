
    const setIf = (el, val) => {

        let result = new Evaluate(el._app.if.exp).value()
// console.log(el._app.if.exp, result)
        if (result && result != false){
            el._app.if.parent.insertBefore(el, el._app.if.parent.children[el._app.if.parent_index])
        } else {
        //    console.log('removing',el)
            el.remove()
        }

    }

    export default setIf
