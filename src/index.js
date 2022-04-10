import './style/style.styl'

// import ObservableSlim from 'observable-slim'
// import DeepProxy from 'nested-proxies'

    import Sortable from 'sortablejs'

import View from './scripts/partials/View'
import Index from './scripts/partials/Index'
import Evaluate from './scripts/partials/Evaluate'
import http from './scripts/partials/http.js'
import init from './scripts/partials/init.js'
import forLoop from './scripts/partials/for.js'
import ContentEditable from './components/ContentEditable.js'
import ModalAuto from './components/ModalAuto.js'
import DropdownSelect from './components/DropdownSelect.js'
import DropdownSearch from './components/DropdownSearch.js'
import TableSearch from './components/TableSearch.js'
import DatePicker from './components/DatePicker.js'
import DatePickerStatic from './components/DatePickerStatic.js'

var path = []

window.proxies = {}
window.update_queue = []
window.update_queue_processing = false
window.update_queue_cnt = 0
window.update_loops = {}
window.view = new View()
window.Index = Index
window.index = new Index()
window.Evaluate = Evaluate
window.evaluate = new Evaluate()
window.http = http
window.extend = {}
window.watch = {}
window.watch_cache = {}
window.ws_host = ''
window.ws_timer = false
window.ws_server = ''
window.ws_ping = false
window.typing = false
window.typing_count = 0
window.typing_timer = false
window._function_call_params = ''

// window.handler = {
//
//     get(target, key, receiver) {
//
//         // if (key == 'isProxy'){
//         //     return true
//         // }
//         //
//         // let copy = Object.assign({}, this)
//         //
//         // !this.path ?
//         //     Object.assign(copy, {path: [key]}) :
//         //     Object.assign(copy, {path: this.path.concat(key)})
//         //
//         // path = copy.path
//         //
//         // const prop = target[key];
//         //
//         // // return if property not found
//         // if (typeof prop == 'undefined'){
//         //     return
//         // }
//         //
//         // // set value as proxy if object
//         // if (typeof prop === 'object' && prop != null && !prop.isProxy){
//         //     target[key] = new Proxy(prop, copy)
//         // }
//
//         console.log(target, key)
//         return target[key]
//
//     },
//
//     set(target, prop, data) {
//
//         console.log('set',target, prop, data)
//
//         path = this.path.concat(prop)
//
//         let idx = index.parsePath(path),
//             old
//
//         if (target[prop]){
//             old = target[prop]
//         }
//
//         target[prop] = data
//
//         if (Array.isArray(target[prop])){ // update all array children (not needed it seems)
//
//             // let idx_child
//             //
//             // for (let i in target[prop]){
//             //     idx_child = index.parsePath([idx,i])
//             //     console.log(idx_child)
//             //     view.updateChildren(idx_child, data[i], old)
//             // }
//
//         } else if (typeof data == 'object'){ // update all object children
//
//             view.updateChildren(idx, data, old)
//
//         }
//
//         view.update(idx, data, old)
//
//         if (typeof window.watch[prop] == 'function'){ // trigger any watch functions
//             window.watch[prop].call(null,data, old)
//         }
//
//         return true
//
//     },
//     path
//
// }

Array.prototype.localSet = function(str){
    localStorage.setItem(str,JSON.stringify(this))
    return this
}

Array.prototype.localGet = function(str){
    let result = JSON.parse(localStorage.getItem(str))
    if (!result){
        result = []
    }
    this.concat(result)
    return this
}

Array.prototype.localRemove = function(str){
    localStorage.removeItem(str)
    return this
}

document.addEventListener("dragover", function(event) {
  event.preventDefault();
})

window.scope = {} // new Proxy({}, handler)
window.scope.view = {}
window.scope.new = {}
window.scope._loaded = false

window.scope._push = function(obj, arr){

    let idx = arr.findIndex(item => {
        return item == obj
    })

    if (!Array.isArray(arr)){
        arr = []
    }

    if (idx < 0){
        arr.push(obj)
    } else {
        arr[idx] = obj
    }
    arr.localSet(this._params[1])
    view.update(this._params[1])

    scope.new = {}

}

window.scope._splice = function(obj, arr){

    if (!Array.isArray(arr)){
        return
    }

    let conf = confirm('Ok to delete this element?')

    if (conf){

        let idx = obj

        if (typeof idx == 'object'){
            idx = arr.findIndex(item => {
                return item == obj
            })
        }

        if (idx >= 0){
            arr.splice(idx,1)
            arr.localSet(this._params[1])
            view.update(this._params[1])
        }

        scope.new = {}

    }

}

window.scope._edit = function(obj,idx){
    scope.openModal('edit')
    scope.new = obj
}

window.scope._notify = function(msg){
    // alert(msg)
}

window.scope._get = function(url, output){

    return new Promise(function(resolve, reject){

        http.get(url)
            .then((data) => {

                data = JSON.parse(data)

                if (scope[output]){
                    scope[output] = data
                }

                resolve(data)

            }).catch((err) => {
                reject(err)
            })

    })

}

window.scope._post = function(url, obj, output){

    return new Promise(function(resolve, reject){

        http.post(url,obj)
            .then((data) => {

                data = JSON.parse(data)

                if (scope[output]){

                    for (var i in scope[output]){
                        if (scope[output][i]._key == data._key){
                            scope[output][i] = data
                            break;
                        }
                        if (i >= scope[output].length-1){
                            scope[output].unshift(data)
                        }
                    }

                }

                resolve(data)

            }).catch((err) => {
                reject(err)
            })

    })

}

window.scope._put = function(url, obj, output){

    return new Promise(function(resolve, reject){

        http.put(url, obj)
            .then((data) => {

                data = JSON.parse(data)

                if (scope[output]){

                    for (var i in scope[output]){
                        if (scope[output][i]._key == data._key){
                            scope[output][i] = data
                            break;
                        }
                        if (i >= scope[output].length-1){
                            scope[output].unshift(data)
                        }
                    }

                }

                resolve(data)

            }).catch((err) => {
                reject(err)
            })

    })

}

window.scope._delete = function(url, output){

    return new Promise(function(resolve, reject) {

        http.delete(url)
            .then((data) => {

                data = JSON.parse(data)

                if (scope[output]){
                    let obj = scope[output].find((o, i) => {
                        if (i == id || o._key === id) {
                            scope[output].splice(i,1)
                            return true; // stop searching
                        }
                    })
                }

                resolve(data)

            }).catch((err) => {
                reject(err)
            })

    })
}


window.app = {
    index: {},
    for:[],
    elements: {},
    animations:[],
    init:[],
    prefix: 'app-'
}

document.addEventListener('DOMContentLoaded', async () => {

    // window.app.elements = view.domSearch(document, function(element) {
    //
    //     if (typeof element.attributes == 'object'){
    //
    //         for (var i=0; i < element.attributes.length; i++){
    //
    //             if (element.attributes[i].nodeName.startsWith(app.prefix)){
    //                 new Index(element.attributes[i].nodeValue, element, element.attributes[i].nodeName)
    //             }
    //
    //             if (element.attributes[i].nodeName == 'anim'){
    //                 window.app.animations.push(element)
    //             }
    //
    //         }
    //
    //     }
    //
    // })

    window.app.elements = document.body.querySelectorAll('*')

    controller()

    for (var i=0; i < window.app.elements.length; i++) {

        let element = window.app.elements[i]

        if (typeof element.attributes == 'object'){

            for (var ii=0; ii < element.attributes.length; ii++){

                if (element.attributes[ii].nodeName.startsWith(app.prefix)){

                    new Index(element.attributes[ii].nodeValue, element, element.attributes[ii].nodeName)
                }

                if (element.dataset.animation || element.dataset.parallax){
                    window.app.animations.push(element)
                }

            }

        }

        if (i >= window.app.elements.length-1){

            scope._loaded = true
            document.querySelector('body').classList.add('loaded')

            inViewChk()

        //    await processFor()
        //    parseAnimAttr()
            initSortable()

            for (let i in window.extend){
                if (window.extend[i] && typeof window.extend[i] == 'function'){
                    window.extend[i]()
                }
            }

            for (let i=0; i < window.app.init.length; i++) {
                init(window.app.init[i])
            }

            view.update('init')

        }

    }



})

window.addEventListener('load', () => {



})

document.addEventListener("click", function (el) {

    if (el.target.classList.contains('context') || el.target.classList.contains('context-link')){

    } else {
        contextCloseAll()
    }

});

document.addEventListener('scroll', () => {
    if (document.body.scrollTop % 20 === 0){
        inViewChk()
    }
})

window.addEventListener('focus', (e) => {
    if (window.ws_host){
        socketConnect()
    }
}, false)

window.addEventListener('blur', (e) => {

}, false)

document.onkeydown = function (event) {

    window.typing = true
    window.typing_count++

    if (window.typing_timer){
        clearTimeout(window.typing_timer)
    }

    window.typing_timer = setTimeout(()=>{
        window.typing = false
    },1000)

};


window.socketConnect = (host) => {

    if (!host && window.ws_host){ // if a check is made and it's down, reconnect
        host = window.ws_host
        if (window.ws_server && window.ws_server.readyState == 1){ // if it's up, don't do anything
            return
        }
    } else if (host){ // start connection to ws
        window.ws_host = host
    } else {
        return
    }

    window.ws_server = new WebSocket(host)

    window.ws_server.onmessage = function(msg){

        let data

        if (typeof msg.data == 'string' && msg.data.match(/\[|\{(.*?)}|\]/)){
            data = JSON.parse(msg.data)
        } else {
            data = msg.data
        }

        // scope.ws_data = data
        view.set('ws_data',data)

    }

    window.ws_server.onerror = function(err){
        if (window.ws_server.readyState !== 1){
            console.log(err, 'Attempting reconnect...')
            if (!window.ws_timer){
                window.ws_timer = setTimeout(()=>{
                    socketConnect(host)
                },3000)
            }

        }
    }

    if (!window.ws_ping){
        window.ws_ping = setInterval(function(){
            if (window.ws_server.readyState !== 1){
                console.log('Socket down, attempting reconnect...')
                socketConnect(host)
            }
        },10000)
    }

}

function processFor(){

    return new Promise( async (resolve, reject) => {

        window.app.for.forEach((el,i)=>{
            forLoop(el.el, true)

            if (i >= window.app.for.length-1){
                resolve()
            }
        })

    })

}

const initSortable = () => {

    let els = document.getElementsByClassName('sortable')
    for (let i in els){

        if (els[i] instanceof Element){

            let offset = 0

            if (els[i].classList.contains('table')){
                offset = 1
            }

            new Sortable(els[i], {
                animation: 150,
                group: 'nested',
                forceFallback: true,
                swapThreshold: 0.65,
                filter:'.sortable-disabled',
                handle: '.sortable-handle',
                ghostClass: 'sortable-ghost',
            	chosenClass: 'sortable-chosen',
            	dragClass: 'sortable-drag',
                onEnd: function (evt) {

                    if (els[i]._app && els[i]._app.sort){

                        let obj = window.evaluate.getValue(els[i]._app.sort.exp),
                            new_index = evt.newIndex-offset,
                            old_index = evt.oldIndex-offset

                        let temp = obj[old_index];
                            obj.splice(old_index, 1);
                            obj.splice(new_index, 0, temp)

                        view.update(els[i]._app.sort.exp)

                        if (els[i]._app && els[i]._app.sorted){
                            new Evaluate(els[i]._app.sorted.exp).value(evt)
                        }

                    } else if (evt.item && evt.item._app && evt.item._app.scope_obj){

                        let obj = window.evaluate.getValue(evt.item._app.scope_obj),
                            new_index = evt.newIndex-offset,
                            old_index = evt.oldIndex-offset

                        let temp = obj[old_index];
                            obj.splice(old_index, 1);
                            obj.splice(new_index, 0, temp)

                        view.update(evt.item._app.scope_obj)

                        if (els[i]._app && els[i]._app.sorted){
                            new Evaluate(els[i]._app.sorted.exp).value(evt)
                        }

                    }

            	},
                onMove: function (evt) {
                    return evt.related.className.indexOf('sortable-disabled') === -1;
                }
            });
        }

    }
}


const parseAnimAttr = () => {

    for (let i = 0; i < window.app.animations.length; i++) {

        let self = app.animations[i],
            attr = self.dataset.animation,
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
                    if (i == 'duration'){
                        self.style.animationDuraton = anim_data[i]
                    }
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

    if (!isNaN(el.dataset.parallax)){
        if (_top <= viewport_h){

            if (!el.dataset.parallax_top){
                el.dataset.parallax_top = 100
            }

            let parallax = window.pageYOffset * parseFloat(el.dataset.parallax)

            if (el.dataset.parallax_direction == "down"){
                el.style.transform = "translateY("+parallax+"px)"
            } else {
                el.style.transform = "translateY(-"+parallax+"px)"
            }


        }

    }

    return (_top <= trigger_bottom && _top >= trigger_top)

}

const inViewChk = () => {

    if (window.app.animations && window.app.animations.length > 0){

        for (let i = 0; i < window.app.animations.length; i++) {

            let self = window.app.animations[i]

            if (inView(self)) {
                if (self.classList && !self.classList.contains('in-view')) {
                    applyInViewClass(self);
                    if (self.hasAttribute('app-lazy')){
                        lazyLoad(self)
                    }
                }
            } else {
                if (self.classList && self.classList.contains('in-view')) {
                    applyExitViewClass(self, i);
                }
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

        if (el.getAttribute("anim-duration")){
            el.style.webkitAnimationDuration = el.getAttribute("anim-duration")
        }
        if (el.getAttribute("anim-easing")){
            el.style.animationTimingFunction = el.getAttribute("anim-easing")
        }
        if (el.getAttribute("anim-delay")){
            el.style.animationDelay = el.getAttribute("anim-delay")
        }

        el.classList.add("in-view")

    }

}

const applyExitViewClass = (el) => {

    if (el.getAttribute('anim-exit')){

        if (el.getAttribute("anim-exit-duration")){
            el.style.animationDuration = el.getAttribute("anim-exit-duration")
        }
        if (el.getAttribute("anim-exit-easing")){
            el.style.animationTimingFunction = el.getAttribute("anim-exit-easing")
        }

        if (el.classList.contains("in-view")){
            el.classList.remove('in-view')
        }

        el.classList.add("exit-view")
        el.style.animationDelay = 0

    }

}

window.createContextMenu = function(name, html, position){

    if (!name || !position){
        return false
    }

    let exists = document.querySelector('.'+name)
    if (exists){
        exists.parentNode.removeChild(exists)
    }

    let new_el = document.createElement("div")
    new_el.innerHTML = html
    new_el.classList.add(name, 'context','context-temp','animate','dropdown','exit-view')
    new_el.style.position = 'fixed'
    new_el.style.zIndex = '999'

    if (window.innerWidth <= 850){
        new_el.style.top = position.top+'px'
        new_el.style.left = '0px'
        new_el.style.width = 'calc(100vw - 2rem)'
    } else {
        new_el.style.top = position.top+'px'
        new_el.style.left = position.left+'px'
        new_el.style.width = position.width+'px'
    }

    document.querySelector('body').append(new_el)
    return new_el

}

window.contextCloseAll = function(){

    document.querySelector('body').style.overflowY = 'auto'

    if (scope && scope.view && scope.view.context){
        scope.view.context = false
    }

    var contexts = document.querySelectorAll('.context')
    for (var i=0; i < contexts.length; i++){
        view.exitView(contexts[i])

        if (contexts[i].classList.contains('context-temp')){
            contexts[i].parentNode.removeChild(contexts[i])
        }
    }

    setTimeout(function(){

        var dropdown_select = document.querySelectorAll('dropdown-select')
        for (var i=0; i < dropdown_select.length; i++){
            dropdown_select[i].style.zIndex = 1
        }

        var dropdown_search = document.querySelectorAll('dropdown-search')
        for (var i=0; i < dropdown_search.length; i++){
            dropdown_search[i].style.zIndex = 1
        }

    },500)
}



const lazyLoad = (el) => {
    el.setAttribute('src',el.getAttribute('app-lazy'))
}
