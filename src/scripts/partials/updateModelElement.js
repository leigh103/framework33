export default function updateModelElement(el, data){

    if (el.type == 'file'){
        return
    }

    if (el.hasAttribute('value')){
        let attr = el.getAttribute('app-model')


        let val = _.get(data, attr)
        if (!val){
            if (!data){
                app.methods.setValue(scope, attr, el.value)
            } else {
                attr = attr.split('.').splice(1).join('.')
                app.methods.setValue(data, attr, el.value)
            }
            return
        }
    }

    if (el.tagName == 'DIV'){ // contentEditable

        el.contentEditable = true

        let val
        if (typeof data == 'string'){
            val = data
        } else {
            let attr = el.getAttribute('app-model'),
                val = _.get(data, attr)
        }

        if (val != '' && el.innerHTML != val && typeof val != 'undefined'){

            el.innerHTML = val

        } else {

        }

    } else if (el.tagName == 'PRE' || el.tagName == "CODE"){ // contentEditable

        el.contentEditable = true

        let val
        if (typeof data == 'string'){
            val = data
        } else {
            let attr = el.getAttribute('app-model'),
                val = _.get(data, attr)
        }

        if (val != '' && el.innerHTML != val && typeof val != 'undefined'){

            val = val.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
               return '&#'+i.charCodeAt(0)+';';
            });

            el.innerHTML = val

        } else {

        }

    } else {

        if (typeof data == 'object'){

            let attr = el.getAttribute('app-index').replace(/__/g,'.').replace(/\.([0-9]+)/,'[$1]'),//.replace(/^(.*?)\./,''),
                val = _.get(scope, attr)

            if (typeof val != 'undefined' && val){
                el.value = val.toString()
            } else {
                el.value = ''
            }

        } else {
            el.value = data
        }

    }


}
