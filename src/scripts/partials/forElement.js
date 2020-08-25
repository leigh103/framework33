export default function forElement(el, data, key, parent_data) {

    let el_prop = el.getAttribute('app-for'),
        sub = false

    if (!el_prop){
        el_prop = el.getAttribute('app-for-sub')
        sub = true
    }

    if (!el_prop){
        return false
    }

    if (!key){
        key = 0
    }

    let el_props = el_prop.match(regex.for_loop),
        el_parent = el.parentNode,
        block = el_props[1],
        scope_key = el_props[2],
        block_key = block,
        loop_arr

    if (data){
        loop_arr = data
        block_key = block+key
    } else if (sub){
        loop_arr = app.methods.getValue(scope, scope_key)
        block_key = block+key
    } else {
        loop_arr = app.methods.getValue(scope, scope_key)
    }

    if (el_parent && !el_parent.className.match(/app\-parent/)){

        el_parent.classList.add('app-parent-'+block_key)
        app.methods.addIndex(el, el_prop, 'foreach')

        app.elements.foreach.root[block_key] = {
            parent: el_parent,
            el: el
        }

        el_parent.removeChild(el)

    //    return

    }


// delete the child nodes from the parent


    let app_for_children = app.elements.foreach.root[block_key].parent.querySelectorAll('.app-for-'+block_key)

    for (let i=0; i < app_for_children.length; i++){
        app.elements.foreach.root[block_key].parent.removeChild(app_for_children[i])
    }


// stop the loop if the data isn't an object


    if (!loop_arr || typeof loop_arr != 'object'){
        return
    }


// loop through the data array and add in the children. no need to be async


    for (let idx=0; idx < loop_arr.length; idx++){

        if (typeof loop_arr[idx] == 'object' || typeof loop_arr[idx] == 'string'){

            let el_clone = {
                    el:app.elements.foreach.root[block_key].el.cloneNode(true),
                    index:idx
                //    scoped_data: loop_arr[idx]
                }

            el_clone.el.scoped_data = loop_arr[idx]
            el_clone[block] = loop_arr[idx]

            el_clone.el.removeAttribute('app-for')
            el_clone.el.removeAttribute('app-for-sub')
            el_clone.el.classList.add('app-for-'+block_key)
            el_clone.el.setAttribute('app-item',block_key)

            app.elements.foreach.root[block_key].parent.appendChild(el_clone.el)

            if (parent_data){
                app.elements.foreach.root[block_key].parent_data = parent_data
            }

            let bind_children = el_clone.el.querySelectorAll('[app-bind]'),
                loop_children = el_clone.el.querySelectorAll('[app-for-sub]'),
                class_children = el_clone.el.querySelectorAll('[app-class]'),
                value_children = el_clone.el.querySelectorAll('[app-value]'),
                click_children = el_clone.el.querySelectorAll('[app-click]'),
                model_children = el_clone.el.querySelectorAll('[app-model]'),
                checked_children = el_clone.el.querySelectorAll('[app-checked]'),
                show_children = el_clone.el.querySelectorAll('[app-show]'),
                hide_children = el_clone.el.querySelectorAll('[app-hide]'),
                logic_children = el_clone.el.querySelectorAll('[app-if]'),
                replace_children = el_clone.el.querySelectorAll('[app-replace]'),
                attr_children = el_clone.el.querySelectorAll('[app-attr]'),
                src_children = el_clone.el.querySelectorAll('[app-src]')

            if (el_clone.el.hasAttribute('app-bind')){

                let val, bind = el_clone.el.getAttribute('app-bind')

                if (bind.match(regex.parent_var) && parent_data){
                    bind = bind.match(regex.parent_var)[1]
                    val = app.methods.getValue(parent_data, bind)
                } else {
                    val = app.methods.getValue(el_clone, bind)
                }

                if (val){
                    el_clone.el.innerHTML = val
                }

            }

            if (el_clone.el.hasAttribute('app-click')){
                el_clone.el.removeEventListener('click',app.methods.clickElement)

                el_clone.el.addEventListener('click', function(){
                    app.methods.clickElement(el_clone.el, el_clone.index, el_clone)
                })
            }

            if (el_clone.el.hasAttribute('app-value')){
                el_clone.el.value = app.methods.getValue(el_clone, el_clone.el.getAttribute('app-value'))
            }

            if (el_clone.el.hasAttribute('app-attr')){
                app.methods.addAttr(el_clone.el, el_clone)
            }

            if (el_clone.el.hasAttribute('app-class')){
                app.methods.addClass(el_clone.el, false, loop_arr[idx])
            }

            for (let i = 0; i < loop_children.length; ++i) { // for each child that has a repeater, call the forElement method

                let bind = loop_children[i].getAttribute('app-for-sub'),
                    cl_props = bind.match(regex.for_loop),
                    val = app.methods.getValue(el_clone, cl_props[2])

                app.methods.addIndex(loop_children[i], cl_props[2], 'foreach')

            //    console.log(block, block_key, scope_key)
                app.methods.forElement(loop_children[i], val, el_clone.index, loop_arr[idx])

            }

            for (let i = 0; i < show_children.length; ++i){

                let el_prop = show_children[i].getAttribute('app-show'),
                    index_key = scope_key+'__'+el_clone.index+'__'+el_prop.replace(/^\w+\(/,'').replace(/^\w+\./,'').replace(/\)$/,'')

                app.methods.addIndex(show_children[i], index_key, 'show')
                app.methods.toggleElement(show_children[i], 'show', el_clone)

            }

            for (let i = 0; i < hide_children.length; ++i){

                let bind = hide_children[i].getAttribute('app-hide'),
                    index_key = scope_key+'__'+el_clone.index+'__'+bind.replace(/^\w+\(/,'').replace(/^\w+\./,'').replace(/\)$/,'')

                app.methods.addIndex(hide_children[i], index_key, 'hide')
                app.methods.toggleElement(hide_children[i], 'hide', el_clone)

            }

            if (logic_children.length > 0 || replace_children.length > 0){

                app.elements.logic.nodes.forEach(function(el) {
                    let attr = el.getAttribute('app-if')
                    app.methods.addIndex(el, attr, 'logic')
                    app.methods.toggleElement(el,'if',el_clone)
                })

            }

            for (let i = 0; i < model_children.length; ++i){

                let bind = model_children[i].getAttribute('app-model'),
                    index_key = scope_key+'__'+el_clone.index+'__'+bind.replace(/^\w+\(/,'').replace(/^\w+\./,'').replace(/\)$/,'')

                app.methods.addIndex(model_children[i], index_key, 'model')

                app.methods.onChangeElement(model_children[i], el_clone.index, el_clone, true)

                if (model_children[i].tagName == "INPUT") {
                    if (model_children[i].type == "text" || model_children[i].type == "number" || model_children[i].type == "password") {
                        model_children[i].addEventListener('keyup', function(){
                            app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                        })
                    }
                    if (model_children[i].type == "number" || model_children[i].type == "file") {
                        model_children[i].addEventListener('change', function(){
                            app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                        })
                    }
                    if (model_children[i].type == "checkbox" || model_children[i].type == "radio") {
                        model_children[i].addEventListener('click', function(){
                            app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                        })
                    }
                }
                if (model_children[i].tagName == "SELECT" || model_children[i].tagName == "TEXTAREA") {
                    model_children[i].addEventListener('change', function(){
                        app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                    })
                }

                if (model_children[i].tagName == "DIV" || model_children[i].tagName == "PRE" || model_children[i].tagName == "CODE") {
                    model_children[i].contentEditable = true
                    let val = app.methods.getValue(el_clone, bind)
                    if (val && val != 'undefined' && val != 'undefined undefined' && typeof val != 'object'){

                        if (model_children[i].tagName == "PRE" || model_children[i].tagName == "CODE"){
                            val = val.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
                               return '&#'+i.charCodeAt(0)+';';
                            });
                        }

                        model_children[i].innerHTML = val
                    } else {
                        model_children[i].innerHTML = ''
                    }
                    model_children[i].addEventListener('input', function(){
                        app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                    })
                }

            }

            for (let i = 0; i < checked_children.length; ++i){

                let el_prop = checked_children[i].getAttribute('app-checked'),
                    index_key = scope_key+'__'+el_clone.index+'__'+el_prop.replace(/^\w+\(/,'').replace(/^\w+\./,'').replace(/\)$/,'')

                app.methods.addIndex(checked_children[i], index_key, 'checked')
                app.methods.updateCheckedElement(checked_children[i], loop_arr[idx])

            }

            for (let i = 0; i < bind_children.length; ++i) { // for each child of this new parent node, get the scope arr value and update the contents

                let bind = bind_children[i].getAttribute('app-bind'),
                    val,
                    index_key

                if (bind.match(regex.parent_var) && parent_data){
                    bind = bind.match(regex.parent_var)[1]
                    val = app.methods.getValue(parent_data, bind)
                } else {
                    val = app.methods.getValue(el_clone, bind)
                }

                index_key = scope_key+'__'+el_clone.index+'__'+bind.replace(/^\w+\(/,'').replace(/^\w+\./,'').replace(/\)$/,'')

                app.methods.addIndex(bind_children[i], index_key, 'bound')

                if (val && val != 'undefined' && val != 'undefined undefined' && typeof val != 'object'){
                    bind_children[i].innerHTML = val
                } else {
                    bind_children[i].innerHTML = ''
                }

            }



            for (let i = 0; i < attr_children.length; ++i){
                app.methods.addAttr(attr_children[i], el_clone)
            }

            for (let i = 0; i < click_children.length; ++i){

                let bind = click_children[i].getAttribute('app-click')

                click_children[i].removeEventListener('click',app.methods.clickElement)

                // if (bind.match(regex.parent_var)){
                //     click_children[i].addEventListener('click', function(){
                //         click_children[i].parent_data = el_clone.el.scoped_data
                //         app.methods.clickElement(click_children[i], el_clone.index, el_clone)
                //     })
                // } else {
                    click_children[i].addEventListener('click', function(){
                        app.methods.clickElement(click_children[i], el_clone.index, el_clone)
                    })
                // }

            }

            for (let i = 0; i < src_children.length; ++i){

                let val = src_children[i].getAttribute('app-src')
                app.methods.addSrc(src_children[i], app.methods.getValue(el_clone, val))

            }

            for (let i = 0; i < class_children.length; ++i) { // for each child of this new parent node, get the scope arr value and update the contents
                let bind = class_children[i].getAttribute('app-class'),
                    val = app.methods.getValue(el_clone,bind)
                app.methods.addClass(class_children[i],val)
            }

        }

    }

}
