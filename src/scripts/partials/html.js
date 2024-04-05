
    const html = (el) => {
        
        let str = new Evaluate(el._app.html.exp).value()

        if (typeof str == 'object'){
            el.innerHTML = JSON.stringify(str)
        } else if (typeof str != 'undefined') {
            el.innerHTML = str.replace(/\n/g,'<br>')
        } else {
            el.innerHTML = ''
        }

    }

    module.exports = html