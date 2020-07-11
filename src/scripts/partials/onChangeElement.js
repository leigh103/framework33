export default function onChangeElement(el, index, data, init){

    let attr, attr_val, set_val, el_val

    if (el.srcElement){
        el = el.srcElement
    }

    attr = el.getAttribute('app-model')

    if (el.type == 'file') {

        var file = el.files[0],
            imageType = /image.*/

        if (file.type.match(imageType)) {

            let reader = new FileReader();

            reader.onload = function(e) {

                var img = new Image();
                img.src = reader.result;
                el_val = img.src

                if (data){

                    set_val = _.get(data, attr)

                    if (init && typeof set_val != 'undefined'){

                        app.methods.onChangeTrigger(el, index, data, init)

                    } else {
                        app.methods.setValue(data, attr, el_val)
                        app.methods.onChangeTrigger(el, index, data, init)
                    }

                } else {

                    set_val = _.get(scope, attr)

                    if (init){

                        if (set_val == false){
                            set_val = ''
                        }

                    } else {
                        app.methods.setValue(scope, attr, el_val)
                    }
                    app.methods.onChangeTrigger(el, index, data, init)
                }

            }

            reader.readAsDataURL(file);

        }
    } else {

        if (data){

            set_val = _.get(data, attr)

            if (typeof set_val == 'boolean'){
                set_val = set_val.toString()
            }

            if (init && typeof set_val != 'undefined'){

                if (!el.value && set_val != el.value){
                    el.value = set_val
                    app.methods.onChangeTrigger(el, index, data, init)
                } else if (el.value){
                    app.methods.setValue(scope, attr, el.value)
                } else {
                    let idx = el.getAttribute('app-index')
                    app.methods.setValue(scope, idx, el.innerHTML)
                }

            } else {
                if (el.tagName == 'DIV'){
                    let idx = el.getAttribute('app-index')
                    app.methods.setValue(scope, idx, el.innerHTML)
                } else {
                    app.methods.setValue(data, attr, el.value)
                }
                app.methods.onChangeTrigger(el, index, data, init)
            }

        } else {

            set_val = _.get(scope, attr)

            if (typeof set_val == 'boolean'){
                set_val = set_val.toString()
            }

            if (init){

                if (set_val == false){
                    set_val = ''
                }
                if (!el.value && set_val != el.value){
                    el.value = set_val
                } else if (el.value){
                    app.methods.setValue(scope, attr, el.value)
                }

            } else {

                if (el.value){
                    app.methods.setValue(scope, attr, el.value)
                } else {
                    app.methods.setValue(scope, attr, el.innerHTML)
                }

            }
            app.methods.onChangeTrigger(el, index, data, init)
        }

    }

}
