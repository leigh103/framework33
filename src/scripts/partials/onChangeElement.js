export default function onChangeElement(el, index, data, init){

    let attr, attr_val, set_val

    if (el.srcElement){
        el = el.srcElement
    }

    attr = el.getAttribute('app-model')

    if (data){

        set_val = _.get(data, attr)

        if (init && typeof set_val != 'undefined'){

            if (set_val != el.value){
                el.value = set_val
                app.methods.onChangeTrigger(el, index, data, init)
            }

        } else {
            app.methods.setValue(data, attr, el.value)
            app.methods.onChangeTrigger(el, index, data, init)
        }

    } else {

        set_val = _.get(scope, attr)

        if (init){

            if (set_val == false){
                set_val = ''
            }
            if (set_val != el.value){
                el.value = set_val
            }
        //    console.log('initoce',set_val)
        } else {
        //    console.log('oce',set_val)
            app.methods.setValue(scope, attr, el.value)
        }
        app.methods.onChangeTrigger(el, index, data, init)
    }

}
