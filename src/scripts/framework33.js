
import '../styles/framework33.scss';

window.onload = function(e){

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

};

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
