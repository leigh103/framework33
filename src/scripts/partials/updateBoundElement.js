
    export default function updateBoundElement(el, index, data){

        if (!data){
            data = scope
        }

        if (el.hasAttribute('app-value')){

            let el_prop = el.getAttribute('app-value'),
                val = _.get(data, el_prop)

            if (val != el.value){
                el.value = val
            } else {
                return
            }

            //el.text = val

            app.methods.addIndex(el, el_prop, 'bound')

        } else {

            let el_prop = el.getAttribute('app-bind')
            let el_parent = el.parentNode

            if (!el_parent || !el_parent.getAttribute('app-for')){

                let val = _.get(data, el_prop)

                if (val != '' && el.innerHTML != val){
                    el.innerHTML = val
                } else {
                    return
                }
                app.methods.addIndex(el, el_prop, 'bound')

            }

        }

    }
