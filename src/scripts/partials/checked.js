
    const checked = (el, val) => {

        let result = new Evaluate(el._app.checked.exp).value()

        if (result && result === true){
            el.checked = true
        } else {
            el.checked = false
        }

    }

    export default checked
