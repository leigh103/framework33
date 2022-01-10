
    const bind = (el) => {
        
        let str = new Evaluate(el._app.bind.exp).value()

        if (typeof str == 'object'){
            el.innerHTML = JSON.stringify(str)
        } else if (typeof str != 'undefined') {
            el.innerHTML = str
        } else {
            el.innerHTML = ''
        }

    }

    module.exports = bind
