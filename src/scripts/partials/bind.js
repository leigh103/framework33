
    const bind = (el) => {
        
        
        let str = new Evaluate(el._app.bind.exp).value()

        if (typeof str == 'object' && str != null){
            el.innerHTML = ''

            for (let key in str) { 
                let str_key = str[key]+''
                el.innerHTML += key.replace(/_/g,' ') + ": " + str_key+'<br>'
                 
            }

        } else if (typeof str != 'undefined') {
            el.innerHTML = str
        } else {

            el.innerHTML = ''
        }

    }

    module.exports = bind
