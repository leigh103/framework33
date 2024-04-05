
    import Evaluate from './Evaluate'
    import bind from './bind'
    import html from './html'
    import show from './show'
    import hide from './hide'
    import checked from './checked'
    import model from './model'
    import forLoop from './for'
    import click from './click'
    import longpress from './longpress'
    import touch from './touch'
    import swipe from './swipe'
    import dragend from './dragend'
    import dragstart from './dragstart'
    import drop from './drop'
    import paste from './paste'
    import change from './change'
    import setIf from './setIf'
    import setClass from './setClass'
    import setSrc from './setSrc'
    import setAttr from './setAttr'


    export default class View {

        set(key, value){
            evaluate.setValue(key, value)
        }

        get(key){
            let val = evaluate.getValue(key)
            return val
        }

        update(key, value, el){

            var index = -1
            for(var i = 0; i < window.update_queue.length; i++) {
                if(window.update_queue[i].key == key) {
                    index = i;
                    break;
                }
            }
            if (index < 0){
                let queue_obj = {key: key, value: value}
                if (el){
                    queue_obj.el = el
                }
                window.update_queue.push(queue_obj)
            }

            if (window.update_queue_processing === false){
                this.processUpdateQueue()
            }

        }

        processUpdateQueue(){

            if (window.update_queue.length > 0){ //&& window.update_queue_cnt < 10){
     
                window.update_queue_processing = true
                if (window.update_queue[0].el){
                    this.processUpdate(window.update_queue[0].key, window.update_queue[0].value, window.update_queue[0].el)
                } else {
                    this.processUpdate(window.update_queue[0].key, window.update_queue[0].value)
                }
                

            } else {
                window.update_queue_processing = false
            }

        }

        processUpdate(key, update, el){

            if (update === true){

            } else {
   
                let for_objs = window.app.for.filter((item)=>{

                    if (key == 'init'){
                        return true
                    } else if (typeof key == 'string'){
                        return item.keys.indexOf(key) >= 0
                    }

                }).map((item)=>{

                    forLoop(item.el, true)
                    return item

                })

                if (for_objs.length > 0){ // if it's a loop, just process that
                //    console.log('view',key, for_objs)
                //    return
                }

            }

            if (this.isArray(key)){

                app.index[key] = app.index[key].filter((item,i)=>{ // update all elements with this key

                    if (item.el.parentNode || item.type == 'if'){

                        if (!el || el && item.el.parentNode == el){
                            this.updateElement(item.el, key, item.type)
                        }

                        return true

                    } else {
                        return false
                    }

                })

            } else if (typeof key == 'object' && Array.isArray(key)) { // if it's an array of values to update loop through them
           
                key.map((item,i)=>{
                    this.update(item.replace(/\'/g,''), key, item.type)
                })

            } else if (typeof key == 'object' && key._params && Array.isArray(key._params)) { // if it's an array of parameters to update loop through them
             
                key._params.map((item,i)=>{
                    this.update(item.replace(/\'/g,''), key, item.type)
                })

            } else if (key == 'boot') {
           
                for (key in app.index){

                    if (evaluate.getValue(key)){

                        app.index[key] = app.index[key].filter((item,i)=>{

                            if (item.el.parentNode || item.type == 'for' || item.type == 'if' || item.type == 'change'){
                                this.updateElement(item.el, key, item.type)
                                return true
                            } else {
                                return false
                            }

                        })

                    }

                }

            }
            
            window.update_queue.splice(0,1)

            this.processUpdateQueue()

        }

        updateChildren(key, data){

            for (let i in data){

                let key_child = index.parsePath([key,i])
                key_child = index.parseKey(key_child)

                if (typeof data[i] == 'object'){
                    this.updateChildren(key_child, data[i])
                }

                this.update(key_child)

            }

        }

        async updateElement(el, key, type){
  
            let chk_watch = false

            if (type == 'model' && el._app.model && el._app.model.keys.indexOf(key) >= 0){

                if (!el._app.model.listening){

                    if (el.tagName == "INPUT") {
                        if (el.type == "text" || el.type == "number" || el.type == "password" || el.type == "email" || el.type == "tel") {
                            el.removeEventListener('input', model)
                            el.addEventListener('input', model)
                        }
                        if (el.type == "number" || el.type == "file" || el.type == "range" || el.type == "color") {
                            el.removeEventListener('change', model)
                            el.addEventListener('change', model)
                        }
                        if (el.type == "checkbox" || el.type == "radio") {
                            el.removeEventListener('click', model)
                            el.addEventListener('click', model)
                        }
                    }

                    if (el.tagName == "TEXTAREA") {
                        el.removeEventListener('input', model)
                        el.addEventListener('input', model)
                    }

                    if (el.tagName == "SELECT") {
                        el.removeEventListener('change', model)
                        el.addEventListener('change', model)
                    }

                    if ( el.tagName == "DIV" || el.tagName == "PRE" || el.tagName == "CODE") {
                        el.removeEventListener('paste', paste)
                        el.addEventListener('paste', paste)
                        el.removeEventListener('input', model)
                        el.addEventListener('input', model)
                    }

                    el._app.model.listening = true

                }

                if (!window.typing){
                    model(false,el)
                }

                chk_watch = true

            } else if (type == 'change' && el._app.change){
                
                if (!el._app.change.listening){

                    if (el.tagName == "INPUT") {
                        if (el.type == "text" || el.type == "number" || el.type == "password" || el.type == "email" || el.type == "tel") {
                            el.removeEventListener('keyup', change)
                            el.addEventListener('keyup', change)
                        }
                        if (el.type == "number" || el.type == "file" || el.type == "range" || el.type == "color") {
                            el.removeEventListener('change', change)
                            el.addEventListener('change', change)
                        }
                        if (el.type == "checkbox" || el.type == "radio") {
                            el.removeEventListener('click', change)
                            el.addEventListener('click', change)
                        }
                    }

                    if (el.tagName == "TEXTAREA") {
                        el.removeEventListener('keyup', change)
                        el.addEventListener('keyup', change)
                    }

                    if (el.tagName == "SELECT") {
                        el.removeEventListener('change', change)
                        el.addEventListener('change', change)
                    }

                    if ( el.tagName == "DIV" || el.tagName == "PRE" || el.tagName == "CODE") {
                        el.removeEventListener('input', change)
                        el.addEventListener('input', change)
                    }

                    el._app.change.listening = true

                }

                chk_watch = true

            } else if (type == 'dragstart' && el._app.dragstart && el._app.dragstart.keys.indexOf(key) >= 0){
                if (!el._app.dragstart.listening){
                    el.setAttribute('draggable','true')
                    el.removeEventListener('dragstart', dragstart)
                    el.addEventListener('dragstart', dragstart)
                    el._app.dragstart.listening = true
                }
            } else if (type == 'drag' && el._app.drag && el._app.drag.keys.indexOf(key) >= 0 || el._app.dragend && el._app.dragend.keys.indexOf(key) >= 0){
                if (!el._app.drag.listening){
                    el.setAttribute('draggable','true')
                    el.removeEventListener('dragend', dragend)
                    el.addEventListener('dragend', dragend)
                    el._app.drag.listening = true
                }
            } else if (type == 'drop' && el._app.drop && el._app.drop.keys.indexOf(key) >= 0){
                if (!el._app.drop.listening){
                    el.removeEventListener('drop', drop)
                    el.addEventListener('drop', drop)

                    el.addEventListener("dragenter", function( evnt ) {
                        evnt.target.classList.add('dropping')
                    }, false)
                    el.addEventListener("dragleave", function( evnt ) {
                        evnt.target.classList.remove('dropping')
                    }, false)
                    el._app.drop.listening = true
                }
            } else if (type == 'class' && el._app.class){

                setClass(el)

            } else if (type == 'bind' && el._app.bind){
                bind(el)
            } else if (type == 'html' && el._app.html){
                html(el)
            } else if (type == 'swipe' && el._app.swipe){
                swipe(el)
            } else if (type == 'click' && el._app.click){

                if (!el._app.click.listening){

                    el.removeEventListener('click', click)
                    el.addEventListener('click', click)
                   
                    el._app.click.listening = true

                }

                chk_watch = true
            
            } else if (type == 'longpress' && el._app.longpress){

                if (!el._app.longpress.listening){

                    if (!device.is_touch){

                        el.removeEventListener('contextmenu', longpress)
                        el.addEventListener('contextmenu', longpress)
                    
                        el._app.click.listening = true

                    } else {

                        el.removeEventListener('touchstart', longpress)
                        el.addEventListener('touchstart', longpress)
                        el.removeEventListener('touchend', longpress)
                        el.addEventListener('touchend', longpress)
                       
                        el._app.longpress.listening = true
                        
                    }
                   

                }

                chk_watch = true
                
            } else if (type == 'paste' && el._app.paste && el._app.keys.indexOf(key) >= 0){

                if (!el._app.paste.listening){
                    el.removeEventListener('paste', paste)
                    el.addEventListener('paste', paste)
                    el._app.paste.listening = true
                }

                chk_watch = true

            } else if (type == 'if' && el._app.if){
            //    setIf(el)
            } else if (type == 'show' && el._app.show && el._app.show.keys.indexOf(key) >= 0){
                show(el)
            } else if (type == 'hide' && el._app.hide && el._app.hide.keys.indexOf(key) >= 0){
                hide(el)
            } else if (type == 'checked' && el._app.checked){
                checked(el)
            } else if (type == 'src' && el._app.src){
                setSrc(el)
            } else if (type == 'attr' && el._app.attr ){
                setAttr(el)
            }

            if (chk_watch === true && window.watch && typeof window.watch[key] == 'function'){

               let new_data = evaluate.getValue(key),
                   old_data
                
                if (!window.watch_cache[key] || window.watch_cache[key] != new_data){
                    window.watch_cache[key] = new_data
                    window.watch[key].call(null,new_data,old_data,key)
                }
               
            }

        //    this.processUpdateQueue()

        }

        enterView(el){

            if (!el){
                return
            }

            return new Promise(function(resolve, reject) {

                let display_value = 'block'

                if (el._app && el._app.show && el._app.show.orig_display){
                    display_value = el._app.show.orig_display
                }

                if (el._app && el._app.hide && el._app.hide.orig_display){
                    display_value = el._app.hide.orig_display
                }

                if (el.classList.contains('animate')){

                    el.style.display = display_value

                    setTimeout(function(){
                        el.classList.add('in-view')
                        el.classList.remove('exit-view')
                    },200)

                } else {
                    el.classList.add('in-view')
                        el.classList.remove('exit-view')
                    el.style.display = display_value
                }

                resolve()

            })

        }


        exitView(el){

            if (!el){
                return
            }

            return new Promise(function(resolve, reject) {

                if (el.classList.contains('animate')){
                    el.classList.remove('in-view')
                    el.classList.add('exit-view')
                    setTimeout(function(){
                        el.style.display = 'none'
                    },400)
                } else {
                    el.classList.remove('in-view')
                    el.classList.add('exit-view')
                    el.style.display = 'none'
                }

                resolve()

            })

        }

        domSearch(element, predicate, results) {

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
                let self = this
                Array.prototype.forEach.call(element.children, function(child) {
                    self.domSearch(child, predicate, results);
                });
            }

            return results

        }

        isArray(key) {
            return Array.isArray(app.index[key])
        }

        isObject(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]'
        }

    }
