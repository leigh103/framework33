export default function clickElement(el, index, data){

    if (el instanceof Element || el instanceof HTMLDocument){
        scope._clicked_element = el.getBoundingClientRect()
    } else {
        scope._clicked_element = false
    }

    if (typeof el.stopPropagation != 'undefined'){
        el.stopPropagation()
    }

    let attr,attr_name = 'app-click', params, parent_var

    if (el.hasAttribute && el.hasAttribute('app-init')){
        attr_name = 'app-init'
    }

    if (el.hasAttribute && el.hasAttribute('app-sort')){
        attr_name = 'app-sort'
    }

    if (typeof el.getAttribute == 'undefined'){
        attr = el.currentTarget.getAttribute(attr_name)
    } else {
        attr = el.getAttribute(attr_name)
    }

    if (attr.match(regex.parent_var)){
        parent_var = app.methods.getValue(data, attr.match(regex.parent_var)[1])
        attr = attr.replace(regex.parent_var,parent_var)
    //    console.log(attr, parent_var)
    }

    if (attr.match(regex.function)){ // if function

        app.methods.getValue(data, attr)

    } else if (attr.match(regex.logic)){ // if operator

        let matches = attr.match(regex.logic),
            key = matches[1],
            val = matches[3].replace(/\"|\'$g/,''),
            val_root = ''

        if (val.match(/^!/)){

            val = val.replace(/^!/,'')
            let val_scope = app.methods.getValue(scope, val)
            app.methods.setValue(scope, val, !val_scope)

        } else if (matches && matches.length > 2){

            if (matches[2] == '='){

                let val_scope

                if (data){
                    val_scope = app.methods.getValue(data, val)
                } else {
                    val_scope = app.methods.getValue(scope, val)
                }

                if (val_scope){
                    app.methods.setValue(scope, key, val_scope)
                } else {
                    app.methods.setValue(scope, key, val)
                }

            }

        } else {
            scope[key] = val
        }


    }

}
