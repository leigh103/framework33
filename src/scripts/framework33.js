
import '../styles/framework33.scss';
import Observable from 'observable-slim'

var test = {}
var app = {}

app.methods = {

    updateBoundElement(el){

        let el_prop = el.getAttribute('app-bind')
        let el_parent = el.parentNode

        if (!el_parent || !el_parent.getAttribute('app-foreach')){
            el.innerHTML = scope[el_prop]

            app.methods.addIndex(el, el_prop, 'bound')
        }



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

            if (scope[el_prop]){
                el.classList.add('app-hidden')
            } else {
                el.classList.remove('app-hidden')
            }

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

                if (el.parentNode){
                    let div = document.createElement("div")
                    div.setAttribute('app-replace',[...app.elements.logic.nodes].indexOf(el))
                    el.parentNode.replaceChild(div,el)
                }

            }

        }

    },

    clickElement(el){

        el.addEventListener('click', function(event) {

            let attr = el.getAttribute('app-click')

            if (attr.match(/\(/)){ // if function

                let method = attr.replace(/\((.*?)\)/,'')
                let param = attr.match(/\((.*?)\)/)[0].replace(/^\(/,'').replace(/\)$/,'').replace(/^\'/,'').replace(/\'$/,'')
                scope[method](param)

            } else if (attr.match(/=/)){ // if operator

                attr = attr.split('=')
                let key = attr[0].replace(/\s/g,'')
                let val = attr[1].replace(/\'/g,'').replace(/^\s/,'').replace(/\s$/,'')
                scope[attr[0].replace(/\s/g,'')] = attr[1].replace(/\'/g,'').replace(/^\s/,'').replace(/\s$/,'')

            }

        })

    },

    keypressElement(el){

        el.addEventListener('keyup', function(event) {
            let attr = el.getAttribute('app-model')
            scope[attr] = el.value
        })

    },

    forEachElement(el, initial, arr){

        let el_prop = el.getAttribute('app-foreach')

        if (initial){ // for the initial render, don't run the loop, just add it to the index
            app.methods.addIndex(el, el_prop, 'foreach')
            return false
        }

        let parent = el.parentNode;

        var props = el_prop.match(/(.*) in (.*)/);
        var view_key = props[1],
            scope_key = props[2]

        if (arr){
            var loop_arr = arr
        } else {
            var loop_arr = scope[scope_key]
        }

        app.methods.removeElements('app-foreach-child-'+scope_key, function(){

            for (let i in loop_arr){ // loop through the scope array

                let block = {}
                block[view_key] = loop_arr[i] // assign current arr element to block scope

                let parentClone = el.cloneNode(true) // clone the parent node and repeat it for how many elements there are in the array
                parentClone.classList.add('app-foreach-child-'+scope_key)

                if (parent.lastChild == el) { // append the clone
                    parent.appendChild(parentClone);
                } else {
                    parent.insertBefore(parentClone, el.nextSibling);
                }

                var children = parentClone.querySelectorAll('[app-bind]'),ii

                for (ii = 0; ii < children.length; ++ii) { // for each child of this new parent node, get the scope arr value and update the contents
                    let bind = children[ii].getAttribute('app-bind')
                    let val = eval('block.'+bind)

                    if (val){
                        children[ii].innerHTML = val
                    }
                }

                var loop_children = parentClone.querySelectorAll('[app-foreach]'),iii
                for (iii = 0; iii < loop_children.length; ++iii) {

                    let bind = loop_children[iii].getAttribute('app-foreach')
                    var cl_props = bind.match(/(.*) in (.*)/);

                    let val = eval('block.'+cl_props[2])

                    app.methods.forEachElement(loop_children[iii], false, val)
                }

            }

        })

    },

    removeElements(className, callback){

        if (!className.match(/^\./)){
            className = '.'+className
        }

        let els = document.querySelectorAll(className)

        if (els.length > 0){

            for (let i in els){

                if (els[i].parentNode){
                    els[i].parentNode.removeChild(els[i])
                }

                if (i >= els.length-1){
                    callback()
                }

            }

        } else {
            callback()
        }

    },

    addIndex(el, el_prop, key){

        if (el_prop && el_prop != null){

            el_prop = el_prop.replace(/^!/,'')

            if (el_prop.match(/in/)){ // if the property is a foreach loop

                el_prop = el_prop.split(/in/)[1]

            } else if (el_prop.match(/\s|=|!|<|>/)){ // if the property is an expression, get the object key we need to index

                el_prop = el_prop.split(/\s|==|!=|=|<=|>=|<|>/)[0]

            }

            el_prop = el_prop.replace(/^[ \t]+|[ \t]+$/,'')

            if (!app.elements[key].index[el_prop]){
                app.elements[key].index[el_prop] = []
            }

            if (app.elements[key].index[el_prop].indexOf(el) === -1){
                app.elements[key].index[el_prop].push(el)
            }

        }

    },

    evaluateProp(el_prop, callback){

        if (el_prop.match(/==/)){

            el_prop = el_prop.replace(/\'/g,'').split('==')
            let key = el_prop[0].replace(/^[ \t]+|[ \t]+$/,'')
            let val = el_prop[1].replace(/^[ \t]+|[ \t]+$/,'')

            if (val === 'false' && scope[key] === false){
                callback(true)
            } else {
                callback(scope[key] == val)
            }

        } else if (el_prop.match(/!=/)){

            el_prop = el_prop.replace(/\'/g,'').split('!=')
            let key = el_prop[0].replace(/^[ \t]+|[ \t]+$/,'')
            let val = el_prop[1].replace(/^[ \t]+|[ \t]+$/,'')

            callback(scope[key] != val)

        } else if (el_prop.match(/^!/)){

            el_prop = el_prop.replace(/\'/g,'').split('!=')
            let key = el_prop[0].replace(/^!/,'').replace(/^[ \t]+|[ \t]+$/,'')

            callback(scope[key] == false)

        } else if (eval('scope.'+el_prop)){
            callback(eval('scope.'+el_prop))
        }

    }

}

document.addEventListener('DOMContentLoaded', () => {

    let document_containers = document.querySelectorAll("section,.container");
    let viewport_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    for (let i = 0; i < document_containers.length; i++) {
        if (document_containers[i].getBoundingClientRect().top < viewport_h) {
            if (document_containers[i].classList && document_containers[i].classList.value && !document_containers[i].classList.value.match(/in-view/)) {
                addInViewClass(document_containers[i]);
            }
        }
    }

    window.addEventListener('scroll', function() {
        for (let i = 0; i < document_containers.length; i++) {
            if (document_containers[i].getBoundingClientRect().top < viewport_h - 200) {
                if (document_containers[i].classList && document_containers[i].classList.value && !document_containers[i].classList.value.match(/in-view/)) {
                    addInViewClass(document_containers[i]);
                }
            } else if (document_containers[i].getBoundingClientRect().top < 0){
                if (document_containers[i].classList && document_containers[i].classList.value && !document_containers[i].classList.value.match(/exit-view/)) {
                    addExitViewClass(document_containers[i]);
                }
            }
        }
    });

    // on ready
    app.elements = {}

    app.elements.bound = {}
    app.elements.logic = {}
    app.elements.show = {}
    app.elements.hide = {}
    app.elements.event = {}
    app.elements.model = {}
    app.elements.foreach = {}

    app.elements.bound.index = {}
    app.elements.logic.index = {}
    app.elements.show.index = {}
    app.elements.hide.index = {}
    app.elements.event.index = {}
    app.elements.model.index = {}
    app.elements.foreach.index = {}

    app.elements.bound.nodes = document.querySelectorAll('[app-bind]')
    app.elements.logic.nodes = document.querySelectorAll('[app-if]')
    app.elements.show.nodes = document.querySelectorAll('[app-show]')
    app.elements.hide.nodes = document.querySelectorAll('[app-hide]')
    app.elements.event.nodes = document.querySelectorAll('[app-click]')
    app.elements.model.nodes = document.querySelectorAll('[app-model]')
    app.elements.foreach.nodes = document.querySelectorAll('[app-foreach]')

    app.elements.bound.nodes.forEach(function(el) {
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
        app.methods.clickElement(el)
    })

    app.elements.model.nodes.forEach(function(el) {
        app.methods.keypressElement(el)
    })

    app.elements.foreach.nodes.forEach(function(el) {
        app.methods.forEachElement(el, true)
    })

});

var scope = Observable.create(test, true, function(changes) {

    for (var i in changes){

        // update any elements with object binding
        if (app.elements.bound.index[changes[i].property]){
            app.elements.bound.index[changes[i].property].forEach(function(el){
                app.methods.updateBoundElement(el)
            })
        }

        // update any elements with logic
        if (app.elements.logic.index[changes[i].property]){
            app.elements.logic.index[changes[i].property].forEach(function(el){
                app.methods.toggleElement(el)
            })
        }

        // update any elements with show
        if (app.elements.show.index[changes[i].property]){
            app.elements.show.index[changes[i].property].forEach(function(el){
                app.methods.toggleElement(el,'show')
            })
        }

        // update any elements with hide
        if (app.elements.hide.index[changes[i].property]){
            app.elements.hide.index[changes[i].property].forEach(function(el){
                app.methods.toggleElement(el,'hide')
            })
        }

        // update any elements with foreach
        if (app.elements.foreach.index[changes[i].property]){
            app.elements.foreach.index[changes[i].property].forEach(function(el){
                app.methods.forEachElement(el)
            })
        }
    }

});



scope.panel = false
scope.menu_items = [
    'welcome',
    'colors',
    'grid',
    'forms'
]

setTimeout(function(){
    scope.menu_items = [
        'Something',
        'else',
        'here'
    ]
},2000)

function addInViewClass(el) {
    let divs = el.querySelectorAll('*'),
        i;
    for (i = 0; i < divs.length; ++i) {
        if (divs[i].classList && divs[i].classList.value && !divs[i].classList.value.match(/in-view/)) {
            if (i == 0){
                applyInViewClass(divs[i], 0);
            } else {
                applyInViewClass(divs[i], i * 200);
            }

        }
    }
}

function applyInViewClass(el, delay) {
    setTimeout(function() {
        el.className += " in-view";
        if (el.getAttribute("anim-duration")){
            el.style.animationDuration = el.getAttribute("anim-duration")
        }
        if (el.getAttribute("anim-easing")){
            el.style.animationTimingFunction = el.getAttribute("anim-easing")
        }
        if (el.getAttribute("anim-delay")){
            el.style.animationDelay = el.getAttribute("anim-delay")
        }
    }, delay);
}


function addExitViewClass(el) {
    let divs = el.querySelectorAll('*'),
        i;
    for (i = 0; i < divs.length; ++i) {
        if (divs[i].classList && divs[i].classList.value && !divs[i].classList.value.match(/exit-view/)) {

                applyExitViewClass(divs[i], 0);


        }
    }
}

function applyExitViewClass(el, delay) {
    setTimeout(function() {
        el.className.value.replace(/in\-view/, 'exit-view');
    }, delay);
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
        console.log(document.documentElement.clientWidth);
        if (document.documentElement.clientWidth > 850) {
            nodes[i].style.height = height + 'px';
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
