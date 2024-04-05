

    const model = (evt, set) => {

        if (set){

            if (set.type == "file"){
                return false
            }
            

            let value = evaluate.getValue(set._app.model.keys[0])

            if (set.type == "checkbox"){
                if (typeof value == 'undefined'){
                    value = false
                }
                set.checked = value
            } else if (set.tagName == "DIV"){
                if (typeof value == 'undefined'){
                    value = ''
                }
                set.innerHTML = value
            } else if (set.tagName == "SELECT"){
                if (typeof value == 'undefined'){
                    value = ''
                }
            //    console.log(set._app.model.keys, value)
                set.value = value
            } else if (set.tagName == "DATE-PICKER" && typeof value == 'string'){

                set.setDate(value)

            } else {
                
                if (typeof value == 'undefined'){
                    value = ''
                }
                set.value = value
            }

        } else {

            let el = evt.target,
                value

            if (el.type == "file"){

                var file = el.files[0],
                    imageType = /image.*/

                if (typeof file == 'object' && typeof file.type == 'string'){ // && file.type.match(imageType)) {

                    let reader = new FileReader();

                    reader.onload = function(e) {

                        if (el._app && el._app.model && el._app.model.exp){

                            evaluate.setValue(el._app.model.exp, reader.result)

                            if (el._app.model.keys.pop() == 'new'){
                                view.set('new.name', file.name.replace(/\.[a-zA-Z0-9]{3,4}$/,''))
                            }
                        }

                        if (el._app && el._app.change && el._app.change.exp){
                            new Evaluate(el._app.change.exp).value(el)
                        }
                    //    console.log(el._app, img)

                    }

                    reader.readAsDataURL(file);

                }

            } else if (el.type == "checkbox"){
                value = el.checked
            } else if (el.tagName == "DIV"){
                value = el.innerHTML
            } else {
                value = el.value
            }

            if (el._app.model){

                evaluate.setValue(el._app.model.keys[0], value)
            }

        }

    }

    export default model
