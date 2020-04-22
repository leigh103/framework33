
import '../styles/framework33.scss'
import '../styles/style.scss'
import Observable from 'observable-slim'
import Sortable from 'sortablejs'
import _ from 'lodash'
import forElement from './partials/forElement'
import getValue from './partials/getValue'
import setValue from './partials/setValue'
import updateBoundElement from './partials/updateBoundElement'
import toggleElement from './partials/toggleElement'
import clickElement from './partials/clickElement'
import onChangeTrigger from './partials/onChangeTrigger'
import onChangeElement from './partials/onChangeElement'
import updateModelElement from './partials/updateModelElement'
import removeElements from './partials/removeElements'
import addClass from './partials/addClass'
import addSrc from './partials/addSrc'
import addAttr from './partials/addAttr'
import addIndex from './partials/addIndex'

global.scope = {}
global.scope.data = []
global.watch = {}
global.http = ''
global.server = ''
global.ws_host = ''
global.ws_timer = false
global.ws_server = ''
global.ws_ping = false
global.typing = false
global.regex = {
    logic_class: /\{\s*'([a-zA-Z0-9._\[\]\-]+)'\s*\:\s*([a-zA-Z0-9._\[\]]+)\s*([!=<>]+)\s*(\'[a-z0-9._\[\]]+\'|[a-z0-9._\[\]]+)\s*\}/,
    logic_function: /\{\s*'([a-zA-Z0-9._\[\]\-]+)'\s*\:\s*([a-zA-Z0-9._\[\]()',\s]+)\s*\}/,
    logic: /([a-zA-Z0-9._!]+)\s*(=|!=|==|===|>|>=|<|<=)\s*(\'[a-zA-Z0-9._!]+\'|[a-zA-Z0-9._()!]+)/, // /([a-za-zA-Z._]+)\s*(=)\s*'?((.*))'?/
    function: /[a-zA-Z0-9._\[\]]+\((.*?)\)/,
    nested_object: /\.|\[\d+\]/,
    for_loop: /([a-zA-Z0-9._]+)\s*in\s*([a-zA-Z0-9._()\[\]]+)/,
    parent_var: /\{\{parent\.([a-zA-Z0-9._()\[\]]+)\}\}/
}
global.test = {}
global.app = {}

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

    updateBoundElement: updateBoundElement,
    getValue: getValue,
    setValue: setValue,
    toggleElement: toggleElement,
    clickElement: clickElement,
    onChangeTrigger: onChangeTrigger,
    onChangeElement: onChangeElement,
    updateModelElement: updateModelElement,
    forElement: forElement,
    removeElements:removeElements,
    addClass: addClass,
    addSrc: addSrc,
    addAttr: addAttr,
    addIndex: addIndex,

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

            if (currentPath.match(/salon/)){
            //    console.log(changes[i], currentPath)
            }

            if (watch[changes[i].currentPath] && changes[i].newValue != changes[i].previousValue){ // fire any watch functions
                let copy_newValue = JSON.parse(JSON.stringify(changes[i].newValue))
                let copy_previousValue = ''
                if (typeof changes[i].previousValue != 'undefined'){
                    copy_previousValue = JSON.parse(JSON.stringify(changes[i].previousValue))
                }
                watch[changes[i].currentPath].call(null, copy_newValue, copy_previousValue, currentPath)
            }

        // update any objects from the model input
            if (app.elements.model.index[currentPath]){

                if (typeof changes[i].previousValue != 'undefined' && changes[i].newValue != changes[i].previousValue){
                    _.set(scope, changes[i].currentPath, changes[i].newValue)
                }

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
        el.self = el
        el.addEventListener('click', app.methods.clickElement)

    })

    app.elements.class.nodes.forEach(function(el) {
        app.methods.addClass(el)
    })

    app.elements.init.nodes.forEach(function(el) {
        app.methods.clickElement(el)
    })

    app.elements.model.nodes.forEach(function(el) {

        if (el.tagName == "INPUT") {
            if (el.type == "text" || el.type == "number" || el.type == "password" || el.type == "email") {
                el.addEventListener('keyup', app.methods.onChangeElement)
            }
            if (el.type == "number") {
                el.addEventListener('change', app.methods.onChangeElement)
            }
            if (el.type == "checkbox" || el.type == "radio") {
                el.addEventListener('click', app.methods.onChangeElement)
            }
        }
        if (el.tagName == "SELECT") {
            el.addEventListener('change', app.methods.onChangeElement)
        }
        if (el.tagName == "TEXTAREA") {
            el.addEventListener('keyup', app.methods.onChangeElement)
        }

        el.self = el

        let attr = el.getAttribute('app-model')
        app.methods.addIndex(el,attr,'model')
        // app.methods.onChangeElement(el, false, false, true)

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

                     app.methods.clickElement(evt.from)

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

window.addEventListener('focus', (e) => {
    if (global.ws_host){
        socketConnect()
    }
}, false)

window.addEventListener('blur', (e) => {

}, false)

document.onkeydown = function (event) {
    global.typing = true

    setTimeout(()=>{
        global.typing = false
    },500)
};


global.socketConnect = (host) => {

    if (!host && global.ws_host){ // if a check is made and it's down, reconnect
        host = global.ws_host
        if (global.ws_server && global.ws_server.readyState == 1){ // if it's up, don't do anything
            return
        }
    } else if (host){ // start connection to ws
        global.ws_host = host
    } else {
        return
    }

    global.ws_server = new WebSocket(host)

    global.ws_server.onmessage = function(msg){

        let data

        if (typeof msg.data == 'string' && msg.data.match(/\[|\{(.*?)}|\]/)){
            data = JSON.parse(msg.data)
        } else {
            data = msg.data
        }

        scope.ws_data = data

    }

    global.ws_server.onerror = function(err){
        if (global.ws_server.readyState !== 1){
            console.log(err, 'Attempting reconnect...')
            if (!global.ws_timer){
                global.ws_timer = setTimeout(()=>{
                    socketConnect(host)
                },3000)
            }

        }
    }

    if (!global.ws_ping){
        global.ws_ping = setInterval(function(){
            if (global.ws_server.readyState !== 1){
                console.log('Socket down, attempting reconnect...')
                socketConnect(host)
            }
        },10000)
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

const lazyLoad = (el) => {
    el.setAttribute('src',el.getAttribute('app-lazy'))
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
