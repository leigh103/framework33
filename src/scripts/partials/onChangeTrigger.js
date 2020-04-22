export default function onChangeTrigger(el, index, data, init){

    let attr, attr_val, set_val

    if (el.srcElement){
        el = el.srcElement
    }

    if (el.hasAttribute('app-change')){

        attr = el.getAttribute('app-change')

        app.methods.addIndex(el, attr, 'model')

        app.methods.getValue(data, attr)

    }

}
