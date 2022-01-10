import _ from 'lodash'
import {CustomElement} from './partials/CustomElement.js'

import http from './partials/http.js'

import './style/style.styl'

window.http = http
window.app = {
    elements:[]
}


Object.defineProperty(app, 'scope', {
  set: function(x) { console.log(x) }
})

app.scope = {}
app.scope.a = "Welcome"

document.addEventListener('DOMContentLoaded', () => {

    window.app.elements = domFind(document, function(element) {
        return element.attributes && Array.prototype.some.call(element.attributes, function(attr) {
            if (attr.nodeName.startsWith("data-")){
            //    index.add(attr.nodeValue, element, attr.nodeName)
                return true
            }
        })
    })

})

function domFind(element, predicate, results) {
    if (!results) {
        results = [];
    }
    if (!element.children) {
        throw new Error("Starting node must be an element or document");
    }
    if (predicate(element)) {
        results.push(element);
    }
    if (element.children && element.children.length) {
        Array.prototype.forEach.call(element.children, function(child) {
            domFind(child, predicate, results);
        });
    }
    return results
}
