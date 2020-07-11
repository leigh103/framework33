
    export default function updateBoundElement(el, index, data){

        if (!data){
            data = scope
        }

        if (el.hasAttribute('app-value')){

            let el_prop = el.getAttribute('app-value'),
                val

            if (el_prop.match(regex.function)){
                val = app.methods.getValue(data, el_prop)
            } else {
                val = _.get(data, el_prop)
            }

            if (val != el.value){
                el.value = val
            } else {

            }

            //el.text = val

            app.methods.addIndex(el, el_prop, 'bound')

        } else {

            let el_prop = el.getAttribute('app-bind')
            let el_parent = el.parentNode

            if (!el_parent || !el_parent.getAttribute('app-for')){

                let val
                if (el_prop.match(regex.function)){
                    val = app.methods.getValue(data, el_prop)
                } else {
                    val = _.get(data, el_prop)
                }

                if (val != '' && el.innerHTML != val && typeof val != 'undefined'){
                    el.innerHTML = val
                } else {

                }
                app.methods.addIndex(el, el_prop, 'bound')

            }

        }

    }
