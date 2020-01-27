
import '../styles/framework33.scss';
import '../styles/style.scss';
import Observable from 'observable-slim'

global.scope = {}
global.scope.data = []
global.watch = {}
global.http = ''
global.server = ''

var test = {},
    app = {}

app.elements = {}

    app.elements.bound = {}
    app.elements.value = {}
    app.elements.logic = {}
    app.elements.show = {}
    app.elements.hide = {}
    app.elements.event = {}
    app.elements.class = {}
    app.elements.model = {}
    app.elements.foreach = {}
    app.elements.init = {}

    app.elements.bound.index = {}
    app.elements.value.index = {}
    app.elements.logic.index = {}
    app.elements.show.index = {}
    app.elements.hide.index = {}
    app.elements.event.index = {}
    app.elements.class.index = {}
    app.elements.model.index = {}
    app.elements.foreach.index = {}
    app.elements.foreach.loops = {}
    app.elements.init.index = {}

app.methods = {

    updateBoundElement(el, index, data){

        // console.log(el)

        if (el.hasAttribute('app-value')){

            let el_prop = el.getAttribute('app-value')

            el.value = app.methods.getValue(scope, el_prop,'')

            app.methods.addIndex(el, el_prop, 'bound')

        } else {

            let el_prop = el.getAttribute('app-bind')
            let el_parent = el.parentNode

            if (!el_parent || !el_parent.getAttribute('app-for')){

                el.innerHTML = app.methods.getValue(scope, el_prop,'')
                app.methods.addIndex(el, el_prop, 'bound')

            }

        }

    },

    getValue(obj, path) {

        let result, string

        if (!path || typeof path != 'string'){
            return ''
        }

        if (!obj){
            obj = scope
        }

        if (path.match(/'|"/)){
            string = true
        } else {
            string = false
        }

        path = path.replace(/'|"/g,'')

        if (path && path.match(/\((.*?)\)$/)){ // if function

            let params = path.match(/\((.*?)\)$/)[1].split(',')

            params = params.map((e)=>{
                let obj_check = app.methods.getValue(obj, e)
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

        } else if (path.match(/\./)){

            result = path.split(".").reduce(function(obj, name){
                        if (obj && obj[name]){
                            return obj[name]
                        }
                    }, obj);

            if (typeof result == 'function'){
                return result()
            } else {

                if (typeof result == 'undefined'){
                    return ''
                } else {
                    return result
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

            return path.replace(/'|"/g,'')

        }

    },

    setValue(obj, path, val) {

        path = path.split(".")
        let result = path.reduce(
                            function(obj_ref, name){

                                if (obj_ref && typeof obj_ref[path[path.length-1]] != 'undefined'){
                                    obj_ref[path[path.length-1]] = val
                                } else if (obj_ref && obj_ref[name]){
                                    return obj_ref[name]
                                }

                            }, obj)

    },

    toggleElement(el, type){

        if (type == 'show'){

            var el_prop = el.getAttribute('app-show')

            app.methods.addIndex(el, el_prop, 'show')

            app.methods.evaluateProp(el_prop, function(result){
                if (result){
                    el.classList.remove('app-hidden')
                } else {
                    el.classList.add('app-hidden')
                }
            })

        } else if (type == 'hide'){

            var el_prop = el.getAttribute('app-hide')

            app.methods.addIndex(el, el_prop, 'hide')

            app.methods.evaluateProp(el_prop, function(result){
                if (result){
                    el.classList.add('app-hidden')
                } else {
                    el.classList.remove('app-hidden')
                }
            })

        } else {

            var el_prop = el.getAttribute('app-if')

            app.methods.addIndex(el, el_prop, 'logic')

            if (scope[el_prop]){

                let index = [...app.elements.logic.nodes].indexOf(el)
                let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]
                div.parentNode.replaceChild(el,div)

            } else if (el_prop.match(/==|\!=|^!/)){

                app.methods.evaluateProp(el_prop, function(test){

                    if (test === false){
                        if (el.parentNode){
                            let div = document.createElement("div")
                            div.setAttribute('app-replace',[...app.elements.logic.nodes].indexOf(el))
                            el.parentNode.replaceChild(div,el)
                        }
                    } else {
                        let index = [...app.elements.logic.nodes].indexOf(el)
                        let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]
                        if (div){
                            div.parentNode.replaceChild(el,div)
                        }

                    }
                })

            } else {

                let index = [...app.elements.logic.nodes].indexOf(el)
                let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]

                if (div){
                    div.parentNode.replaceChild(el,div)
                }

            }

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

        if (attr.match(/(\w+)\((.*?)\)/)){ // if function

            let matches = attr.match(/(\w+)\((.*?)\)/),
                method = matches[1],
                param = matches[2]

            if (param.match(/\,/)){

                params = param.split(',');
                for (var i in params){

                    params[i] = app.methods.getValue(data,params[i].replace(/^\s|\s$/,''))

                    if (i == params.length-1){
                        params = params.map((e)=>{
                            if (typeof e == 'string'){
                                return e.replace(/^['"]|['"]$/g,'')
                            } else {
                                return e
                            }

                        })
                        scope[method].apply(null,params)
                    }
                }

            } else if (scope[method]){

                if (data && data[param]){
                    scope[method](data[param])
                } else {
                    scope[method](param.replace(/^['"]|['"]$/g,''))
                }

            }

        } else if (attr.match(/([a-za-zA-Z._]+)\s*(=)\s*'?((.*))'?/)){ // if operator

            let matches = attr.match(/([a-za-zA-Z._]+)\s*(=)\s*'?((.*))'?/),
                key = matches[1],
                val = matches[3].replace(/\"|\'$g/,''),
                val_root = ''

            // if (index){ // if using a value from a for loop
            //     val_root = val.split('.')[0]
            //     let str = 'app.elements.foreach.loops.'+val_root+'['+index+'].'+val
            //     val = eval(str)
            // }

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

                //    console.log(scope, key,obj)
                }

            } else {
                scope[key] = val
            }


        }

    },

    onChangeElement(el, index, data, init){

        let attr, set_val

        if (el.srcElement){
            el = el.srcElement
        }

        attr = el.getAttribute('app-model')

        app.methods.addIndex(el, attr, 'model')

        if (data){

            set_val = app.methods.getValue(data, attr)

            if (init && typeof set_val != 'undefined'){

                el.value = set_val

                for (var i=0; i<el.children.length; i++){

                    if (el.children[i].hasAttribute('value') && el.children[i].getAttribute('value') == set_val){
                    //    console.log('using value',el.children[i].getAttribute('value'),set_val)
                        el.children[i].setAttribute('selected',true)
                    } else if (el.children[i].innerHTML && el.children[i].innerHTML.toString() == set_val.toString()){
                    //    console.log('using html',el.children[i].innerHTML.toString(), set_val.toString())
                        el.children[i].setAttribute('selected',true)
                    } else {
                        el.children[i].removeAttribute('selected')
                    }

                }

            } else {
                app.methods.setValue(data, attr, el.value)
            }

        } else {

            set_val = app.methods.getValue(scope, attr)

            if (init && typeof set_val != 'undefined'){
                el.value = set_val
            } else {
                app.methods.setValue(scope, attr, el.value)
            }
        }

    },

    forElement(el, initial, data, key){

        var el_prop = el.getAttribute('app-for'),
            el_props = el_prop.match(/([a-zA-Z._]+)\s*in\s*([a-zA-Z._()]+)/i)


        if (initial){ // for the initial render, don't run the loop, just add it to the index
            app.methods.addIndex(el, el_prop.replace(/\.[0-9a-z]+/g,''), 'foreach')
            return false
        }

        let el_parent = el.parentNode,
            view_key = el_props[1],
            scope_key = el_props[2],
            scope_key_parse = scope_key.replace(/\./g,'_'),
            loop_arr = app.methods.getValue(scope, scope_key),
            el_remove = false,
            block = view_key

            if (el.hasAttribute('app-index')){
                block = el.getAttribute('app-index')
            }

            if (data){ // if this is a nested repeater

                loop_arr = data
                block = view_key+key

            }

            function runLoop() {

                return Promise.resolve()

                    .then(function() { // create the elements needed at first run, but after that just update the content

                        if (loop_arr && loop_arr != 'undefined'){

                            for (let i = 0; i < loop_arr.length; ++i){

                                if (i == 0){

                                    let el_arr_data = {el:el, [view_key]:loop_arr[i]}

                                    if (!app.elements.foreach.loops[block]){

                                        app.elements.foreach.loops[block] = []

                                    }

                                    if (!app.elements.foreach.loops[block][i]){

                                        app.elements.foreach.loops[block][i] = el_arr_data

                                    } else {

                                        app.elements.foreach.loops[block][i][view_key] = loop_arr[i]

                                    }

                                } else {

                                    if (!app.elements.foreach.loops[block][i]){

                                        let el_clone = el.cloneNode(true), // clone the parent node
                                            el_arr_data = {el:el_clone, [view_key]:loop_arr[i]}

                                        el_clone.classList.remove('app-for-parent-'+scope_key_parse)
                                        el_clone.classList.add('app-for-child-'+scope_key_parse)
                                        el_clone.removeAttribute('app-for')

                                        el_parent.appendChild(el_clone)

                                        app.elements.foreach.loops[block][i] = el_arr_data

                                    } else {

                                        app.elements.foreach.loops[block][i][view_key] = loop_arr[i]

                                    }

                                }

                            }

                        }

                    })
                    .then(function() { // remove any elements where the data has been removed also

                        if (loop_arr && app.elements.foreach.loops[block] && loop_arr.length < app.elements.foreach.loops[block].length){

                            for (let i = 0; i < app.elements.foreach.loops[block].length; ++i){

                                if (typeof loop_arr[i] == 'undefined' && el_parent){

                                    el_parent.removeChild(app.elements.foreach.loops[block][i].el)
                                    app.elements.foreach.loops[block].splice(i,1)

                                }
                            }
                        }

                    })
                    .then(function() { // add in or update the content

                        if (app.elements.foreach.loops[block]){

                            for (let i = 0; i < app.elements.foreach.loops[block].length; ++i){

                                let self = app.elements.foreach.loops[block][i],
                                    self_key = i,
                                    children = self.el.querySelectorAll('[app-bind]'),
                                    loop_children = self.el.querySelectorAll('[app-for]'),
                                    class_children = self.el.querySelectorAll('[app-class]'),
                                    value_children = self.el.querySelectorAll('[app-value]'),
                                    click_children = self.el.querySelectorAll('[app-click]'),
                                    model_children = self.el.querySelectorAll('[app-model]')

                                if (self.el.hasAttribute('app-bind')){
                                    self.el.innerHTML = app.methods.getValue(self, self.el.getAttribute('app-bind'))
                                }

                                if (self.el.hasAttribute('app-value')){
                                    self.el.value = app.methods.getValue(self, self.el.getAttribute('app-value'))
                                }

                                for (let i = 0; i < children.length; ++i) { // for each child of this new parent node, get the scope arr value and update the contents

                                    let bind = children[i].getAttribute('app-bind'),
                                        val = app.methods.getValue(self, bind)

                                    if (val){
                                        children[i].innerHTML = val
                                    }

                                }

                                for (let i = 0; i < class_children.length; ++i) { // for each child of this new parent node, get the scope arr value and update the contents

                                    let bind = children[i].getAttribute('app-class'),
                                        val = app.methods.getValue(self, bind),
                                        orig_class_list = children[i].getAttribute('app-orig-class')

                                    if (!children[i].getAttribute('app-initial')){
                                        children[i].setAttribute('app-orig-class',children[i].classList)
                                    }

                                    if (val){

                                        if (orig_class_list){
                                            children[i].className = orig_class_list
                                        } else {
                                            children[i].className = ''
                                        }

                                        children[i].classList.add(val)
                                    }

                                    children[i].setAttribute('app-initial',true)

                                }

                                for (let i = 0; i < loop_children.length; ++i) { // for each child that has a repeater, call the forElement method

                                    let bind = loop_children[i].getAttribute('app-for'),
                                        cl_props = bind.match(/(.*) in (.*)/),
                                        val = app.methods.getValue(self, cl_props[2])

                                    app.methods.forElement(loop_children[i], false, val, self_key)

                                }

                                for (let i = 0; i < click_children.length; ++i){

                                    click_children[i].removeEventListener('click',app.methods.clickElement)

                                    click_children[i].addEventListener('click', function(){
                                        app.methods.clickElement(click_children[i], self_key, self)
                                    })

                                }

                                for (let i = 0; i < model_children.length; ++i){

                                    model_children[i].removeEventListener('change',app.methods.onChangeElement)

                                    app.methods.onChangeElement(model_children[i], self_key, self, true)
                                    model_children[i].addEventListener('change', function(){
                                        app.methods.onChangeElement(model_children[i], self_key, self)
                                    })

                                }

                            }

                        }
                    })

            }

            runLoop()

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

    addClass(el){

        var el_prop = el.getAttribute('app-class'),
            class_name = app.methods.getValue(scope, el_prop),
            orig_class_list = el.getAttribute('app-orig-class')

        if (!el.getAttribute('app-initial')){
            orig_class_list = el.classList.value
            el.setAttribute('app-orig-class',orig_class_list.replace(/app\-hidden/,''))
        }

        if (class_name){

            if (orig_class_list){
                el.className = orig_class_list
            } else {
                el.className = ''
            }

            el.classList.add(class_name)
        }

        el.setAttribute('app-initial',true)

        app.methods.addIndex(el, el_prop, 'class')

    },

    addIndex(el, el_prop, key){

        if (el_prop && el_prop != null){

            el_prop = el_prop.replace(/^!/,'')

            if (el_prop.match(/\sin\s/)){ // if the property is a foreach loop

                el_prop = el_prop.split(/\sin\s/)[1].replace(/\./g,'_')

            } else if (el_prop.match(/\s|=|!|<|>/)){ // if the property is an expression, get the object key we need to index

                el_prop = el_prop.split(/\s|==|!=|=|<=|>=|<|>/)[0]

            }

            let orig_el_prop = el_prop+''

            if (el_prop.match(/\./)){ // if nested object, use the route as the index
                let route_el_prop = el_prop.split('.')
                let popped = route_el_prop.pop()
                app.methods.addIndex(el, route_el_prop.join('.'), key)
            }

            el_prop = el_prop.replace(/^[ \t]+|[ \t]+$/,'').replace(/\(|\)/g,'').replace(/\./g,'__')

            let el_prop_index = ''

            if (!app.elements[key].index[el_prop]){
                app.elements[key].index[el_prop] = []
                el_prop_index = el_prop
            } else {
                el_prop_index = el_prop+'_'+app.elements[key].index[el_prop].length // add a different index if 2 or more elements share the same one
            }

            el.setAttribute('app-index',el_prop_index)

            if (app.elements[key].index[el_prop].indexOf(el) === -1){
                app.elements[key].index[el_prop].push(el)
            }

        }

    },

    evaluateProp(el_prop, callback){

        let matches = el_prop.match(/([a-zA-Z._!]+)\s*(!=|==|>|>=|<|<=)\s*'?([a-zA-Z._]+)'?/)

        if (matches){

            if (matches.length > 1 && matches[2] == '=='){

                if (matches[3] === 'false' && scope[matches[1]] === false){
                    callback(true)
                } else {
                    callback(scope[matches[1]] == matches[3])
                }

            } else if (matches.length > 1 && matches[2] == '!='){

                callback(scope[matches[1]] != matches[3])

            }

        } else if (el_prop.match(/^!/)){ // falsy

            el_prop = el_prop.replace(/^!/,'')

            if (!app.methods.getValue(scope, el_prop)){
                callback(true)
            } else {
                callback(false)
            }

        } else {

            callback(app.methods.getValue(scope,el_prop))

        }

    }

}

document.addEventListener('DOMContentLoaded', () => {

    app.elements.bound.nodes = document.querySelectorAll('[app-bind],[app-model]')
    app.elements.value.nodes = document.querySelectorAll('[app-value]')
    app.elements.logic.nodes = document.querySelectorAll('[app-if]')
    app.elements.show.nodes = document.querySelectorAll('[app-show]')
    app.elements.hide.nodes = document.querySelectorAll('[app-hide]')
    app.elements.event.nodes = document.querySelectorAll('[app-click]')
    app.elements.class.nodes = document.querySelectorAll('[app-class]')
    app.elements.model.nodes = document.querySelectorAll('[app-model]')
    app.elements.foreach.nodes = document.querySelectorAll('[app-for]')
    app.elements.init.nodes = document.querySelectorAll('[app-init]')

    app.elements.animation = document.querySelectorAll("[anim],[anim-enter],[anim-exit]")

    scope = Observable.create(test, true, function(changes) {

        for (var i in changes){

            let currentPath

            if (isNaN(changes[i].property)){ // logic to use the index in the currentPath value
                currentPath = changes[i].currentPath.replace(/\./g,'__')
            } else {
                currentPath = changes[i].currentPath.replace(/\.[0-9]+/g,'').replace(/\./g,'__')
            }

            // console.log(changes[i], currentPath)

            if (watch[changes[i].currentPath]){ // fire any watch functions
                watch[changes[i].currentPath].call(null, changes[i].newValue, changes[i].previousValue, currentPath)
            }

            // update any elements with object binding
            if (app.elements.bound.index[currentPath]){
                app.elements.bound.index[currentPath].forEach(function(el){
                    app.methods.updateBoundElement(el)
                })
            }

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

            // update any elements with hide
            if (app.elements.class.index[currentPath]){
                app.elements.class.index[currentPath].forEach(function(el){
                    app.methods.addClass(el)
                })
            }

            // update any elements with model
            if (app.elements.model.index[currentPath]){
                app.elements.model.nodes.forEach(function(el) {
                    el.self = el
                    app.methods.onChangeElement(el, false, false, true)
                })
            }

        }

    });




})

window.addEventListener('load', () => {

    controller()

    socketConnect("ws://davidrozman.reformedreality.com:6410")

    parseAnimAttr()

    inViewChk()

    app.elements.bound.nodes.forEach(function(el) {
        app.methods.updateBoundElement(el)
    })

    app.elements.value.nodes.forEach(function(el) {
        app.methods.updateBoundElement(el)
    })

    app.elements.logic.nodes.forEach(function(el) {
        app.methods.toggleElement(el)
    })

    app.elements.show.nodes.forEach(function(el) {
        app.methods.toggleElement(el,'show')
    })

    app.elements.hide.nodes.forEach(function(el) {
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
            if (el.type == "text") {
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
            el.addEventListener('change', app.methods.onChangeElement)
        }

        el.self = el

        app.methods.onChangeElement(el, false, false, true)
    })

    app.elements.foreach.nodes.forEach(function(el) {
        app.methods.forElement(el, true)
    })

})

document.addEventListener('scroll', () => {
    if (document.body.scrollTop % 20 === 0){
        inViewChk()
    }
})

const socketConnect = (host) => {

    server = new WebSocket(host)

    server.onmessage = function(msg){

        let data

        if (typeof msg.data == 'string'){
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
        trigger_top = 100
    } else {
        trigger_top = viewport_h * (parseFloat(trigger_top.replace('%',''))/100)
    }

    if (!trigger_bottom){
        trigger_bottom = viewport_h - 100
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
        el.classList.remove('exit-view')
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

let document_navs = document.getElementsByClassName("nav");
for (let i = 0; i < document_navs.length; i++) {
    document_navs[i].addEventListener('click', showNavLinks, false);
}

function showNavLinks() {
    this.classList.toggle("open");
}
let document_nav_bars = document.getElementsByClassName("nav-bar");
for (let i = 0; i < document_nav_bars.length; i++) {
    document_nav_bars[i].addEventListener('click', showNavBarLinks, false);
}

function showNavBarLinks() {
    this.classList.toggle("open");
}

document.onclick = function(event) {
    let hasParent = false;
    for (let node = event.target; node != document.body; node = node.parentNode) {
        if (node && node.classList && node.classList.contains('nav') || node.classList.contains('nav-bar')) {
            hasParent = true;
            break;
        }
    }
    if (hasParent) {} else {
        for (let i = 0; i < document_navs.length; i++) {
            document_navs[i].classList.remove('open');
        }
        for (let i = 0; i < document_nav_bars.length; i++) {
            document_nav_bars[i].classList.remove('open');
        }
    }
};

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
                        reject(request.status)
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
