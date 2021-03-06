
import '../styles/framework33.scss'
import '../styles/style.scss'
import Observable from 'observable-slim'
import Sortable from 'sortablejs'
import _ from 'lodash'

global.scope = {}
global.scope.data = []
global.watch = {}
global.http = ''
global.server = ''
global.typing = false

var test = {},
    app = {},
    regex = {
        logic_class: /\{\s*'([a-zA-Z0-9._\[\]\-]+)'\s*\:\s*([a-zA-Z0-9._\[\]]+)\s*([!=<>]+)\s*(\'[a-z0-9._\[\]]+\'|[a-z0-9._\[\]]+)\s*\}/,
        logic: /([a-zA-Z0-9._!]+)\s*(=|!=|==|===|>|>=|<|<=)\s*(\'[a-zA-Z0-9._]+\'|[a-zA-Z0-9._()]+)/, // /([a-za-zA-Z._]+)\s*(=)\s*'?((.*))'?/
        function: /[a-zA-Z0-9._\[\]]+\((.*?)\)/,
        nested_object: /\.|\[\d+\]/,
        for_loop: /([a-zA-Z0-9._]+)\s*in\s*([a-zA-Z0-9._()\[\]]+)/
    }

app.elements = {
    bound: {
        index:{}
    },
    value: {
        index:{}
    },
    logic: {
        index:{}
    },
    show: {
        index:{}
    },
    hide: {
        index:{}
    },
    event: {
        index:{}
    },
    class: {
        index:{}
    },
    model: {
        index:{}
    },
    foreach: {
        index:{},
        root:{}
    },
    init: {
        index:{}
    },
    src: {
        index:{}
    },
    data: {
        index:{}
    },
    attr: {
        index:{}
    }
}

app.methods = {

    updateBoundElement(el, index, data){

        if (el.hasAttribute('app-value')){

            let el_prop = el.getAttribute('app-value')

            el.value = app.methods.getValue(scope, el_prop,'')

            app.methods.addIndex(el, el_prop, 'bound')

        } else {

            let el_prop = el.getAttribute('app-bind')
            let el_parent = el.parentNode

            if (!el_parent || !el_parent.getAttribute('app-for')){

                let val = app.methods.getValue(scope, el_prop,'')
                if (val != ''){
                    el.innerHTML = val
                }
                app.methods.addIndex(el, el_prop, 'bound')

            }

        }

    },

    getValue(obj, path, string) {

        let result

        if (!path || typeof path != 'string'){
            return ''
        }

        if (!obj){
            obj = scope
        }

        if (path.match(/'|"/)){
            string = true
        } else if (typeof string == 'undefined'){
            string = false
        }

    //    path = path.replace(/'|"/g,'')

        if (path == '{{index}}' && obj.index >= 0){

            return obj.index+''

        } else if (path.match(regex.logic_class)) { // if logic eg, {'active': obj.path == 'something'} - if true, returns the first string

            let matches = path.match(regex.logic_class),
                result = matches[1],
                val1_obj = app.methods.getValue(obj,matches[2]),
                val1_scope = app.methods.getValue(scope,matches[2]),
                op = matches[3],
                val2 = matches[4],
                val2_obj = {},
                val2_scope = {}

                if (val2.match(/\'(.*?)\'/)){
                    val2_obj = val2.replace(/\'/g,'')

                } else {
                    val2_obj = app.methods.getValue(obj,matches[4]),
                    val2_scope = app.methods.getValue(scope,matches[4])
                }


            if (op == '=='){

                if (val1_obj == val2_obj ||
                    val1_obj == val2_scope ||
                    val1_scope == val2_obj ||
                    val1_scope == val2_scope
                ){
                    return result
                }

            } else if (op == '==='){

                if (val1_obj === val2_obj ||
                    val1_obj === val2_scope ||
                    val1_scope === val2_obj ||
                    val1_scope === val2_scope
                ){
                    return result
                }

            } else if (op == '!='){

                if (val1_obj != val2_obj ||
                    val1_obj != val2_scope ||
                    val1_scope != val2_obj ||
                    val1_scope != val2_scope
                ){
                    return result
                }

            } else if (op == '>'){

                if (val1_obj > val2_obj ||
                    val1_obj > val2_scope ||
                    val1_scope > val2_obj ||
                    val1_scope > val2_scope
                ){
                    return result
                }

            } else if (op == '<'){

                if (val1_obj < val2_obj ||
                    val1_obj < val2_scope ||
                    val1_scope < val2_obj ||
                    val1_scope < val2_scope
                ){
                    return result
                }

            } else if (op == '>='){

                if (val1_obj >= val2_obj ||
                    val1_obj >= val2_scope ||
                    val1_scope >= val2_obj ||
                    val1_scope >= val2_scope
                ){
                    return result
                }

            } else if (op == '<='){

                if (val1_obj <= val2_obj ||
                    val1_obj <= val2_scope ||
                    val1_scope <= val2_obj ||
                    val1_scope <= val2_scope
                ){
                    return result
                }

            }

        } else if (path && path.match(regex.function)){ // if function

            let params = path.match(regex.function)[1].split(',')

            params = params.map((e)=>{

                if (e.match(/'|"/)){
                    string = true
                } else {
                    string = false
                }
                let obj_check = app.methods.getValue(obj, e, string)

                if (obj_check){
                    return obj_check
                } else {
                    return e.replace(/'|"/g,'')
                }

            })

            path = path.replace(/\((.*?)\)/,'')

            if (typeof scope[path] == 'function'){
                return scope[path].apply(this, params)
            }

        } else if (path.match(regex.logic)){

            let matches = path.match(regex.logic),
                val1 = app.methods.getValue(obj,matches[1]),
                op = matches[2],
                val2 = matches[3]

                if (!val2.match(/\'(.*?)\'/)){
                    val2 = app.methods.getValue(obj,matches[3])
                } else {
                    val2 = val2.replace(/\'/g,'')
                }

                if (op == '=='){

                    if (val1 == val2){
                        return true
                    } else {
                        return false
                    }

                } else if (op == '==='){

                    if (val1 === val2){
                        return true
                    } else {
                        return false
                    }

                } else if (op == '!='){

                    if (val1 != val2){
                        return true
                    } else {
                        return false
                    }

                } else if (op == '>'){

                    if (val1 > val2){
                        return result
                    }

                } else if (op == '<'){

                    if (val1 < val2){
                        return true
                    } else {
                        return false
                    }

                } else if (op == '>='){

                    if (val1 >= val2){
                        return true
                    } else {
                        return false
                    }

                } else if (op == '<='){

                    if (val1 <= val2){
                        return true
                    } else {
                        return false
                    }

                }

        } else if (path.match(regex.nested_object)){

            result = _.get(obj, path)

            if (path == 'nested[0].settings.levels'){

            //    console.log(path, result)
            }
            if (typeof result != 'undefined'){
                if (typeof result == 'function'){
                    return result()
                } else {
                    return result
                }
            } else {
                let scope_result = _.get(scope, path)
                if (typeof scope_result != 'undefined'){
                    if (typeof scope_result == 'function'){
                        return scope_result()
                    } else {
                        return scope_result
                    }
                } else {
                    return false
                }
            }


        } else if (obj[path] && string === false){

            result = obj[path]

            if (typeof result == 'function'){
                return result()
            } else {
                return result
            }

        } else {

            if (scope[path] && string === false){
                if (typeof scope[path] == 'function'){
                    return scope[path]()
                } else {
                    return scope[path]
                }
            } else if (string === true){
                return path.replace(/'|"/g,'')
           } else {
               return obj
           }

        }

    },

    setValue(obj, path, val) {

        _.set(obj, path, val)

    },

    toggleElement(el, type, obj){

        if (!obj){
            obj = scope
        }

        if (type == 'show'){

            let el_prop = el.getAttribute('app-show'),
                val = app.methods.getValue(obj, el_prop),
                anim_children = el.querySelector('[anim]')
            //    console.log(obj, el_prop, val)

            if (val){

                if (el.classList.contains('grid')){
                    el.style.display = 'grid'
                } else if (el.classList.contains('btn')){
                    el.style.display = 'inline-flex'
                } else if (el.classList.contains('flex') || el.classList.contains('modal')){
                    el.style.display = 'flex'
                } else if (el.tagName == 'SPAN'){
                    el.style.display = 'inline'
                } else {
                    el.style.display = 'block'
                }

                el.classList.add('in-view')

                if (anim_children && anim_children.length > 0){

                    for (let i=0; i<anim_children.length;i++){
                        anim_children[i].classList.remove('exit-view')
                        anim_children[i].classList.add('in-view')
                    }

                } else if (anim_children) {
                    anim_children.classList.remove('exit-view')
                    anim_children.classList.add('in-view')
                }

            } else {

                el.style.display = 'none'
                el.classList.remove('in-view')

                if (anim_children && anim_children.length > 0){

                    for (let i=0; i<anim_children.length;i++){
                        anim_children[i].classList.remove('in-view')
                        anim_children[i].classList.add('exit-view')
                    }

                } else if (anim_children) {
                    anim_children.classList.remove('in-view')
                    anim_children.classList.add('exit-view')
                }

            }

        } else if (type == 'hide'){

            var el_prop = el.getAttribute('app-hide'),
                val = app.methods.getValue(obj, el_prop),
                anim_children = el.querySelector('[anim]')

            if (val){

                el.style.display = 'none'
                el.classList.remove('in-view')

                if (anim_children && anim_children.length > 0){

                    for (let i=0; i<anim_children.length;i++){
                        anim_children[i].classList.remove('in-view')
                        anim_children[i].classList.add('exit-view')
                    }

                } else if (anim_children) {
                    anim_children.classList.remove('in-view')
                    anim_children.classList.add('exit-view')
                }

            } else {

                if (el.classList.contains('grid')){
                    el.style.display = 'grid'
                } else if (el.classList.contains('btn')){
                    el.style.display = 'inline-flex'
                } else if (el.classList.contains('flex') || el.classList.contains('modal')){
                    el.style.display = 'flex'
                } else if (el.tagName == 'SPAN'){
                    el.style.display = 'inline'
                } else {
                    el.style.display = 'block'
                }

                el.classList.add('in-view')

                if (anim_children && anim_children.length > 0){

                    for (let i=0; i<anim_children.length;i++){
                        anim_children[i].classList.remove('exit-view')
                        anim_children[i].classList.add('in-view')
                    }

                } else if (anim_children) {
                    anim_children.classList.remove('exit-view')
                    anim_children.classList.add('in-view')
                }

            }

        } else {

            var el_prop = el.getAttribute('app-if')

            // if (scope[el_prop]){
            //
            //     let index = [...app.elements.logic.nodes].indexOf(el)
            //     let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]
            //     div.parentNode.replaceChild(el,div)
            //
            // } else if (el_prop.match(/==|\!=|^!/)){
            //
            //     app.methods.evaluateProp(el_prop, function(test){
            //
            //         if (test === false){
            //             if (el.parentNode){
            //                 let div = document.createElement("div")
            //                 div.setAttribute('app-replace',[...app.elements.logic.nodes].indexOf(el))
            //                 el.parentNode.replaceChild(div,el)
            //             }
            //         } else {
            //             let index = [...app.elements.logic.nodes].indexOf(el)
            //             let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]
            //             if (div){
            //                 div.parentNode.replaceChild(el,div)
            //             }
            //
            //         }
            //     })
            //
            // } else {
            //
            //     let index = [...app.elements.logic.nodes].indexOf(el)
            //     let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]
            //
            //     if (div){
            //         div.parentNode.replaceChild(el,div)
            //     }
            //
            // }

        }

    },

    clickElement(el, index, data){

        let attr,attr_name = 'app-click', params

        if (el.hasAttribute && el.hasAttribute('app-init')){
            attr_name = 'app-init'
        }

        if (typeof el.getAttribute == 'undefined'){
            attr = el.currentTarget.getAttribute(attr_name)
        } else {
            attr = el.getAttribute(attr_name)
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
                //console.log(val, !val_scope)
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

    },

    onChangeTrigger(el, index, data, init){

        let attr, attr_val, set_val

        if (el.srcElement){
            el = el.srcElement
        }

        if (el.hasAttribute('app-change')){

            attr = el.getAttribute('app-change')

            app.methods.addIndex(el, attr, 'model')

            app.methods.getValue(data, attr)

        }

    },

    onChangeElement(el, index, data, init){

        let attr, attr_val, set_val

        if (el.srcElement){
            el = el.srcElement
        }

        attr = el.getAttribute('app-model')

        if (data){

            set_val = app.methods.getValue(data, attr)

            if (init && typeof set_val != 'undefined'){

            //    setTimeout(function(){

                    el.value = set_val
                    app.methods.onChangeTrigger(el, index, data, init)

            //    },100)


            } else {
                app.methods.setValue(data, attr, el.value)
                app.methods.onChangeTrigger(el, index, data, init)
            }

        } else {

            set_val = app.methods.getValue(scope, attr)

            if (init){
                if (set_val == false){
                    set_val = ''
                }
                el.value = set_val
            //    console.log('initoce',set_val)
            } else {
            //    console.log('oce',set_val)
                app.methods.setValue(scope, attr, el.value)
            }
            app.methods.onChangeTrigger(el, index, data, init)
        }

    },

    updateModelElement(el, data){

        if (typeof data == 'object'){

            let attr = el.getAttribute('app-index').replace(/__/g,'.').replace(/\.([0-9]+)/,'[$1]'),//.replace(/^(.*?)\./,''),
                val = _.get(scope, attr)

            if (typeof val != 'undefined'){
                el.value = val
            } else {
                el.value = ''
            }

        } else {
            el.value = data
        }

    },

    forElement(el, data, key){

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
            app.methods.addIndex(el_parent, el_prop, 'foreach')
            app.elements.foreach.root[block_key] = {
                parent: el_parent,
                el: el
            }

            el_parent.removeChild(el)

        //    return

        }

        if (block_key == 'level'){
        //    console.log(loop_arr, scope_key)
        }


    // delete the child nodes from the parent


        let app_for_children = app.elements.foreach.root[block_key].parent.querySelectorAll('.app-for-'+block_key)

        for (let i=0; i < app_for_children.length; i++){
            app.elements.foreach.root[block_key].parent.removeChild(app_for_children[i])
        }


    // stop the loop if the data isn't an object


        if (typeof loop_arr != 'object'){
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

                let bind_children = el_clone.el.querySelectorAll('[app-bind]'),
                    loop_children = el_clone.el.querySelectorAll('[app-for-sub]'),
                    class_children = el_clone.el.querySelectorAll('[app-class]'),
                    value_children = el_clone.el.querySelectorAll('[app-value]'),
                    click_children = el_clone.el.querySelectorAll('[app-click]'),
                    model_children = el_clone.el.querySelectorAll('[app-model]'),
                    show_children = el_clone.el.querySelectorAll('[app-show]'),
                    hide_children = el_clone.el.querySelectorAll('[app-hide]'),
                    attr_children = el_clone.el.querySelectorAll('[app-attr]'),
                    src_children = el_clone.el.querySelectorAll('[app-src]')

                if (el_clone.el.hasAttribute('app-bind')){

                    let val = app.methods.getValue(el_clone, el_clone.el.getAttribute('app-bind'))

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
                //    el_clone.el.scoped_data = el_clone.scoped_data
                    app.methods.addClass(el_clone.el)
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

                for (let i = 0; i < model_children.length; ++i){

                    let bind = model_children[i].getAttribute('app-model'),
                        index_key = scope_key+'__'+el_clone.index+'__'+bind.replace(/^\w+\(/,'').replace(/^\w+\./,'').replace(/\)$/,'')

                    app.methods.addIndex(model_children[i], index_key, 'model')

                    app.methods.onChangeElement(model_children[i], el_clone.index, el_clone, true)

                    if (model_children[i].tagName == "INPUT") {
                        if (model_children[i].type == "text" || model_children[i].type == "number" || model_children[i].type == "password") {
                        //    model_children[i].removeEventListener('keyup',app.methods.onChangeElement)
                            model_children[i].addEventListener('keyup', function(){
                                app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                            })
                        }
                        if (model_children[i].type == "checkbox") {

                        //    model_children[i].removeEventListener('click',app.methods.onChangeElement)
                            model_children[i].addEventListener('click', function(){
                                app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                            })
                        }
                        if (model_children[i].type == "radio") {
                        //    model_children[i].removeEventListener('click',app.methods.onChangeElement)
                            model_children[i].addEventListener('click', function(){
                                app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                            })
                        }
                    }
                    if (model_children[i].tagName == "SELECT") {
                    //    model_children[i].removeEventListener('input',app.methods.onChangeElement)
                        model_children[i].addEventListener('input', function(){
                            app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                        })
                    }

                    if (model_children[i].tagName == "TEXTAREA") {
                        model_children[i].addEventListener('keyup', function(){
                            app.methods.onChangeElement(model_children[i], el_clone.index, el_clone)
                        })
                    }

                }

                for (let i = 0; i < bind_children.length; ++i) { // for each child of this new parent node, get the scope arr value and update the contents

                    let bind = bind_children[i].getAttribute('app-bind'),
                        val = app.methods.getValue(el_clone, bind),
                        index_key = scope_key+'__'+el_clone.index+'__'+bind.replace(/^\w+\(/,'').replace(/^\w+\./,'').replace(/\)$/,'')

                    app.methods.addIndex(bind_children[i], index_key, 'bound')

                    if (val && val != 'undefined' && val != 'undefined undefined'){
                        bind_children[i].innerHTML = val
                    } else {
                        bind_children[i].innerHTML = ''
                    }

                }

                for (let i = 0; i < loop_children.length; ++i) { // for each child that has a repeater, call the forElement method

                    let bind = loop_children[i].getAttribute('app-for-sub'),
                        cl_props = bind.match(regex.for_loop),
                        val = app.methods.getValue(el_clone, cl_props[2])

                    app.methods.addIndex(loop_children[i], cl_props[2], 'foreach')

                    app.methods.forElement(loop_children[i], val, el_clone.index)

                }

                for (let i = 0; i < attr_children.length; ++i){
                    app.methods.addAttr(attr_children[i], el_clone)
                }

                for (let i = 0; i < click_children.length; ++i){

                    click_children[i].removeEventListener('click',app.methods.clickElement)

                    click_children[i].addEventListener('click', function(){
                        app.methods.clickElement(click_children[i], el_clone.index, el_clone)
                    })

                }

                for (let i = 0; i < src_children.length; ++i){

                    let val = src_children[i].getAttribute('app-src')
                    app.methods.addSrc(src_children[i], app.methods.getValue(el_clone, val))

                }

                for (let i = 0; i < class_children.length; ++i) { // for each child of this new parent node, get the scope arr value and update the contents
                    app.methods.addClass(class_children[i])
                }

            }

        }

    },

    removeElements(className, el, callback){

        if (!className.match(/^\./)){
            className = '.'+className
        }

        if (el){
            var els = el.querySelectorAll(className)
        } else {
            var els = document.querySelectorAll(className)
        }


        if (els.length > 0){

            for (let i in els){

                if (els[i].parentNode){
                    els[i].parentNode.removeChild(els[i])
                }

                if (i >= els.length-1){
                    if (callback){
                        callback()
                    }
                }

            }

        } else {
            if (callback){
                callback()
            }
        }

    },

    addClass(el, class_name){

        var el_prop = el.getAttribute('app-class'),
            orig_class_list = el.getAttribute('app-orig-class')

        if (!class_name){
            if (el.scoped_data){
                class_name = app.methods.getValue(el.scoped_data, el_prop)
            } else {
                class_name = app.methods.getValue(scope, el_prop)
            }
        }
// console.log(el.scoped_data, el_prop, class_name)
        if (!el.getAttribute('app-initial')){
            orig_class_list = el.classList.value
            el.setAttribute('app-orig-class',orig_class_list.replace(/app\-hidden/,''))
        }

        if (orig_class_list){
            el.className = orig_class_list
        } else {
            el.className = ''
        }

        if (class_name){
            el.classList.add(class_name)
        }

        el.setAttribute('app-initial',true)

        app.methods.addIndex(el, el_prop, 'class')

    },

    addSrc(el, data){

        var el_prop = el.getAttribute('app-src'),
            src_url = app.methods.getValue(scope, el_prop)

        if (typeof data == 'string' && data.match(/png|jpg|jpeg|svg$/)){
            el.setAttribute('src',data)
        } else if (typeof src_url == 'string' && src_url.match(/png|jpg|jpeg|svg$/)) {
            el.setAttribute('src',src_url)
        }

        app.methods.addIndex(el, el_prop, 'src')

    },

    addAttr(el, data){

        var el_prop = el.getAttribute('app-attr'),
            el_prop_arr

        if (el_prop){
            el_prop_arr = el_prop.replace(/{/,'').replace(/}/,'').split(',')
        }

        for (let i in el_prop_arr){

            let attr = el_prop_arr[i].split(':')[0],
                attr_val = el_prop_arr[i].split(':')[1],
                prefix = '',
                postfix = '',
                val

            if (attr_val.match(/'(.*?)'\+(.*?)/)){
               prefix = attr_val.split('+')
               attr_val = prefix[1]
               prefix = prefix[0].replace(/'/g,'')
            } else if (attr_val.match(/(.*?)\+'(.*?)'/)){
               prefix = attr_val.split('+')
               attr_val = prefix[0]
               prefix = prefix[1].replace(/'/g,'')
            }

            val = app.methods.getValue(data, attr_val)

            el.setAttribute(attr, prefix+val+postfix)

        }

        app.methods.addIndex(el, el_prop, 'attr')

    },

    addIndex(el, el_prop, key, index){

        if (el_prop.match(/\{\{(.*?)\}\}/)){
            return false
        }

        if (el_prop && el_prop != null){

            el_prop = el_prop.replace(/^!/,'')

            if (el_prop.match(/\sin\s/)){ // if the property is a for loop

                el_prop = el_prop.split(/\sin\s/)[1].replace(/\./g,'__')


            } else if (el_prop.match(regex.logic_class)){

                let matches = el_prop
                    matches = matches.match(regex.logic_class),
                    el_prop = matches[2]

                app.methods.addIndex(el, matches[4], key)

            } else if (el_prop.match(regex.logic)){ // if the property is an expression, get the object key we need to index

                el_prop = el_prop.split(/\s|==|!=|=|<=|>=|<|>/)[0]

            }

            let orig_el_prop = el_prop+''

            if (el_prop.match(/\__/)){ // if nested object, use the route as the index
                let route_el_prop = el_prop.split('__')
                let popped = route_el_prop.pop()
                if (key == 'foreach'){
                    console.log('popped',el_prop)
                }
                app.methods.addIndex(el, popped, key)
            }

            el_prop = el_prop.replace(/^[ \t]+|[ \t]+$/,'').replace(/\(|\)/g,'').replace(/\./g,'__')

            el.setAttribute('app-index',el_prop)



            if (!app.elements[key].index[el_prop]){
                app.elements[key].index[el_prop] = []
            }

            if (app.elements[key].index[el_prop].indexOf(el) === -1){
                app.elements[key].index[el_prop].push(el)
            }

        }

    },

    parseData(el){

        let data = el.getAttribute('app-data').split('|')[0],
            key = el.getAttribute('app-data').split('|')[1]

        scope[key] = JSON.parse(data)


    },

    parseIndex(index){

        return index.replace(/__/g,'.').replace(/\.([0-9]+)/g,'[$1]')

    }

}

document.addEventListener('DOMContentLoaded', () => {

    app.elements.bound.nodes = document.querySelectorAll('[app-bind]')
    app.elements.value.nodes = document.querySelectorAll('[app-value]')
    app.elements.logic.nodes = document.querySelectorAll('[app-if]')
    app.elements.show.nodes = document.querySelectorAll('[app-show]')
    app.elements.hide.nodes = document.querySelectorAll('[app-hide]')
    app.elements.event.nodes = document.querySelectorAll('[app-click]')
    app.elements.class.nodes = document.querySelectorAll('[app-class]')
    app.elements.model.nodes = document.querySelectorAll('[app-model]')
    app.elements.foreach.nodes = document.querySelectorAll('[app-for]')
    app.elements.init.nodes = document.querySelectorAll('[app-init]')
    app.elements.src.nodes = document.querySelectorAll('[app-src]')
    app.elements.attr.nodes = document.querySelectorAll('[app-attr]')
    app.elements.data.nodes = document.querySelectorAll('[app-data]')

    app.elements.animation = document.querySelectorAll("[anim],[anim-enter],[anim-exit]")

    scope = Observable.create(test, true, function(changes) {

        for (var i in changes){

            let currentPath,forEachPath,nested_objects = []

            if (isNaN(changes[i].property)){ // logic to use the index in the currentPath value
                currentPath = changes[i].currentPath.replace(/\./g,'__')
            } else {
                currentPath = changes[i].currentPath.replace(/\.[0-9]+/g,'').replace(/\./g,'__')
            }

            if (currentPath.match(/nested/)){
                console.log(changes[i], currentPath)
            }

            if (watch[changes[i].currentPath]){ // fire any watch functions
                watch[changes[i].currentPath].call(null, changes[i].newValue, changes[i].previousValue, currentPath)
            }

        // update any objects from the model input
            if (app.elements.model.index[currentPath]){

                _.set(scope, changes[i].currentPath, changes[i].newValue)
                app.elements.model.index[currentPath].forEach(function(el) {

                    if (global.typing === false){
                        app.methods.updateModelElement(el, changes[i].newValue)
                    } else {
                    //    console.log(global.typing, el, changes[i])
                    }

                })
            }


        // update any elements with object binding

            if (app.elements.bound.index[currentPath]){
                app.elements.bound.index[currentPath].forEach(function(el){
                    app.methods.updateBoundElement(el)
                })
            }

        // update any elements with value attr

            if (app.elements.value.index[currentPath]){
                app.elements.value.index[currentPath].forEach(function(el){
                    app.methods.updateBoundElement(el)
                })
            }

        // update any elements with logic

            if (app.elements.logic.index[currentPath]){
                app.elements.logic.index[currentPath].forEach(function(el){
                //    console.log(app.elements.logic.index)
                    app.methods.toggleElement(el)
                })
            }

        // update any elements with show

            if (app.elements.show.index[currentPath]){
                app.elements.show.index[currentPath].forEach(function(el){
                    app.methods.toggleElement(el,'show')
                })
            }

        // update any elements with hide

            if (app.elements.hide.index[currentPath]){
                app.elements.hide.index[currentPath].forEach(function(el){
                    app.methods.toggleElement(el,'hide')
                })
            }

        // update any elements with foreach

            if (app.elements.foreach.index[currentPath]){
                app.elements.foreach.index[currentPath].forEach(function(el){
                    app.methods.forElement(el)
                })
            }

        // update any elements with class

            if (app.elements.class.index[currentPath]){
                app.elements.class.index[currentPath].forEach(function(el){
                    app.methods.addClass(el)
                })
            }

        // update any elements with hide

            if (app.elements.src.index[currentPath]){
                app.elements.src.index[currentPath].forEach(function(el){
                    app.methods.addSrc(el)
                })
            }

        // update any elements with attr

            if (app.elements.attr.index[currentPath]){
                app.elements.attr.index[currentPath].forEach(function(el){
                    app.methods.addAttr(el)
                })
            }

        }

    });




})

window.addEventListener('load', () => {

    controller()

    // socketConnect("ws://davidrozman.reformedreality.com:6410")

    parseAnimAttr()

    inViewChk()

    app.elements.bound.nodes.forEach(function(el) {
        app.methods.updateBoundElement(el)
    })

    app.elements.value.nodes.forEach(function(el) {
        app.methods.updateBoundElement(el)
    })

    app.elements.logic.nodes.forEach(function(el) {
        let attr = el.getAttribute('app-if')
        app.methods.addIndex(el, attr, 'logic')
        app.methods.toggleElement(el)
    })

    app.elements.show.nodes.forEach(function(el) {
        let attr = el.getAttribute('app-show')
        app.methods.addIndex(el, attr, 'show')
        app.methods.toggleElement(el,'show')
    })

    app.elements.hide.nodes.forEach(function(el) {
        let attr = el.getAttribute('app-hide')
        app.methods.addIndex(el, attr, 'hide')
        app.methods.toggleElement(el,'hide')
    })

    app.elements.event.nodes.forEach(function(el) {
        el.addEventListener('click', app.methods.clickElement)
        el.self = el
    })

    app.elements.class.nodes.forEach(function(el) {
        app.methods.addClass(el)
    })

    app.elements.init.nodes.forEach(function(el) {
        app.methods.clickElement(el)
    })

    app.elements.model.nodes.forEach(function(el) {

        if (el.tagName == "INPUT") {
            if (el.type == "text" || el.type == "number" || el.type == "password") {
                el.addEventListener('keyup', app.methods.onChangeElement)
            }
            if (el.type == "checkbox") {
                el.addEventListener('click', app.methods.onChangeElement)
            }
            if (el.type == "radio") {
                el.addEventListener('click', app.methods.onChangeElement)
            }
        }
        if (el.tagName == "SELECT") {
            el.addEventListener('input', app.methods.onChangeElement)
        }
        if (el.tagName == "TEXTAREA") {
            el.addEventListener('keyup', app.methods.onChangeElement)
        }

        el.self = el

        let attr = el.getAttribute('app-model')
        app.methods.addIndex(el,attr,'model')
        app.methods.onChangeElement(el, false, false, true)
    })

    app.elements.foreach.nodes.forEach(function(el) {
        app.methods.forElement(el)
    })

    app.elements.src.nodes.forEach(function(el) {
        app.methods.addSrc(el, true)
    })

    app.elements.data.nodes.forEach(function(el) {
        app.methods.parseData(el, true)
    })

    app.elements.attr.nodes.forEach(function(el) {
        app.methods.addAttr(el, true)
    })

    let els = document.getElementsByClassName('sortable')
    for (let i in els){

        if (els[i] instanceof Element){

            let offset = 1

            if (els[i].classList.contains('table')){
                offset = 1
            }

            new Sortable(els[i], {
                animation: 150,
                filter:'.sortable-disabled',
                ghostClass: 'sortable-ghost',
            	chosenClass: 'sortable-chosen',
            	dragClass: 'sortable-drag',
                onEnd: function (evt) {

            		let raw_prop = evt.item.getAttribute('app-index'),
                        prop = app.methods.parseIndex(raw_prop),
                        obj = _.get(scope, prop),
                        new_index = evt.newIndex-offset,
                        old_index = evt.oldIndex-offset,
                        to = Object.assign({},obj[new_index]),
                        from = Object.assign({},obj[old_index])

                     obj[new_index] = from
                     obj[old_index] = to

            	},
                onMove: function (evt) {
                    return evt.related.className.indexOf('sortable-disabled') === -1;
                }
            });
        }

    }

})

document.addEventListener('scroll', () => {
    if (document.body.scrollTop % 20 === 0){
        inViewChk()
    }
})

document.onkeydown = function (event) {
    global.typing = true

    setTimeout(()=>{
        global.typing = false
    },500)
};

const socketConnect = (host) => {

    server = new WebSocket(host)

    server.onmessage = function(msg){

        let data

        if (typeof msg.data == 'string' && msg.data.match(/\[|\{(.*?)}|\]/)){
            data = JSON.parse(msg.data)
        } else {
            data = msg.data
        }

        scope.data = data

    }

    server.onerror = function(err){
        if (server.readyState !== 1){
            // setTimeout(()=>{
            //     window.location.href="/"
            // },3000)
        }
    }

}




const parseAnimAttr = () => {
    for (let i = 0; i < app.elements.animation.length; i++) {

        let self = app.elements.animation[i],
            attr = self.getAttribute('anim'),
            anim_data = ''

        if (attr && attr.match(/^{/)){

            // allowed keys are: anim, enter, exit, duration, exit-duration, easing, exit-easing, delay, trigger-top, trigger-bottom, iteration-count, fill-mode

            anim_data = JSON.parse(attr.replace(/'/g,'"'))

            for (let i in anim_data){
                if (i == 'anim'){
                    self.setAttribute('anim',anim_data[i])

                    if (anim_data['iteration-count']){
                        self.style.animationIterationCount = anim_data['iteration-count']
                    } else if (anim_data['fill-mode']){
                        self.style.animationFillMode = anim_data['fill-mode']
                    } else if (anim_data['duration']){
                        self.style.animationDuraton = anim_data['duration']
                    } else if (anim_data['easing']){
                        self.style.animationEasing = anim_data['easing']
                    }

                } else {
                    self.setAttribute('anim-'+i,anim_data[i])
                }

            }

        }

    }
}

const inView = (el) => {

    let trigger_top = el.getAttribute('anim-trigger-top'),
        trigger_bottom = el.getAttribute('anim-trigger-bottom'),
        viewport_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        _top = el.getBoundingClientRect().top

    if (!trigger_top){
        trigger_top = 10
    } else {
        trigger_top = viewport_h * (parseFloat(trigger_top.replace('%',''))/100)
    }

    if (!trigger_bottom){
        trigger_bottom = viewport_h - 10
    } else {
        trigger_bottom = viewport_h * (parseFloat(trigger_bottom.replace('%',''))/100)
        trigger_bottom = viewport_h - trigger_bottom
    }

    return (_top <= trigger_bottom && _top >= trigger_top)

}

const inViewChk = () => {

    for (let i = 0; i < app.elements.animation.length; i++) {

        let self = app.elements.animation[i]

        if (inView(self)) {
            if (self.classList && !self.classList.contains('in-view')) {
                applyInViewClass(self);
            }
        } else {
            if (self.classList && self.classList.contains('in-view')) {
                applyExitViewClass(self, i);
            }
        }

    }

}

const applyInViewClass = (el) => {

    if (el.classList.contains("exit-view")){
        setTimeout(function(){ // stop flickering
            el.classList.remove('exit-view')
        },1000)
    }

    if (!el.classList.contains("in-view")){

        el.classList.add("in-view")

        if (el.getAttribute("anim-duration")){
            el.style.animationDuration = el.getAttribute("anim-duration")
        }
        if (el.getAttribute("anim-easing")){
            el.style.animationTimingFunction = el.getAttribute("anim-easing")
        }
        if (el.getAttribute("anim-delay")){
            el.style.animationDelay = el.getAttribute("anim-delay")
        }

    }

}

const applyExitViewClass = (el) => {

    if (el.getAttribute('anim-exit')){

        if (el.classList.contains("in-view")){
            el.classList.remove('in-view')
        }

        el.classList.add("exit-view")
        el.style.animationDelay = 0

        if (el.getAttribute("anim-exit-duration")){
            el.style.animationDuration = el.getAttribute("anim-exit-duration")
        }
        if (el.getAttribute("anim-exit-easing")){
            el.style.animationTimingFunction = el.getAttribute("anim-exit-easing")
        }

    }

}



window.onresize = function(event) {
    let ch_height = 0;
    let card_headers = document.querySelectorAll(".card .header");
    for (let i = 0; i < card_headers.length; i++) {
        if (card_headers[i] && card_headers[i].offsetHeight && card_headers[i].offsetHeight > ch_height) {
            ch_height = card_headers[i].offsetHeight;
        }
        if (i >= card_headers.length - 1) {
            setHeight(card_headers, ch_height);
        }
    }
    let cb_height = 0;
    let card_bodies = document.querySelectorAll(".card .body");
    for (let i = 0; i < card_bodies.length; i++) {
        if (card_bodies[i] && card_bodies[i].offsetHeight && card_bodies[i].offsetHeight > cb_height) {
            cb_height = card_bodies[i].offsetHeight;
        }
        if (i >= card_bodies.length - 1) {
            setHeight(card_bodies, cb_height);
        }
    }
    let fh_containers = document.querySelectorAll(".fixed-height");
    for (let i = 0; i < fh_containers.length; i++) {
        setHeight(fh_containers[i].children, fh_containers[i].offsetHeight);
    }
};

function initFH() {
    let fh_containers = document.querySelectorAll(".fixed-height");
    for (let i = 0; i < fh_containers.length; i++) {
        setHeight(fh_containers[i].children, fh_containers[i].offsetHeight);
    }
    let ch_height = 0;
    let card_headers = document.querySelectorAll(".card .header");
    for (let i = 0; i < card_headers.length; i++) {
        if (card_headers[i] && card_headers[i].offsetHeight && card_headers[i].offsetHeight > ch_height) {
            ch_height = card_headers[i].offsetHeight;
        }
        if (i >= card_headers.length - 1) {
            setHeight(card_headers, ch_height);
        }
    }
    let cb_height = 0;
    let card_bodies = document.querySelectorAll(".card .body");
    for (let i = 0; i < card_bodies.length; i++) {
        if (card_bodies[i] && card_bodies[i].offsetHeight && card_bodies[i].offsetHeight > cb_height) {
            cb_height = card_bodies[i].offsetHeight;
        }
        if (i >= card_bodies.length - 1) {
            setHeight(card_bodies, cb_height);
        }
    }
}

initFH();

function setHeight(nodes, height) {
    for (let i = 0; i < nodes.length; i++) {
        if (document.documentElement.clientWidth > 850) {
            nodes[i].style.height = height + 'px';
        }
    }
}


http = function(method,url,payload){

    if (method.match(/^get|put|post|delete$/i)){

        return new Promise(function(resolve, reject){

            let request = new XMLHttpRequest();

            request.onreadystatechange=function(){

                if (request.readyState==4){
                    if (request.status==200){
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
            }

            request.open(method.toUpperCase(), url);

            if (payload){

                request.setRequestHeader('Content-type', 'application/json')
                request.send(JSON.stringify(payload))

            } else {

                request.send(null);

            }

        })

    } else {

        return new Promise(function(resolve, reject){

            let request = new XMLHttpRequest();

            request.onreadystatechange=function(){

                if (request.readyState==4){
                    if (request.status==200){

                        resolve(request.response)

                    } else {
                        console.log('Error')
                        reject(request.status)
                    }
                }
            }

            request.open("GET", method);
            request.send(null);

        })

    }

}



function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + " " + expires;
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split('');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
