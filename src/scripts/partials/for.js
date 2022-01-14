    import click from './click'

    const forLoop = (el, render) => {

        return new Promise( async (resolve, reject) => {

            if (window.update_loops.hasOwnProperty(el._app.for.scope_obj) && window.update_loops[el._app.for.scope_obj] == el){ // if there's an update in progress, don't update
                console.log(el._app.for.scope_obj+ ' in progress')
                return
            } else {
                window.update_loops[el._app.for.scope_obj] = el
            }

            if (el._app.for.children){ // remove children from the DOM and the array
                el._app.for.children = el._app.for.children.filter((child)=>{
                    child.remove()
                    return false
                })
            } else {
                el._app.for.children = []
            }

            el._app.for.data = evaluate.getValue(el._app.for.scope_obj)

            if (!el._app.for.data || el._app.for.data.length == 0){ // if there's no data don't loop
                delete window.update_loops[el._app.for.scope_obj]
                return false
            }

            let master = el.cloneNode(true)
            master.removeAttribute('app-for')
            master.removeEventListener('mouseup',click)

            parseAttributes([master, ...master.querySelectorAll(':scope *')], el._app.for.obj, el._app.for.scope_obj).then((master) => {

                if (typeof el._app.for.data == 'object' && el._app.for.data.length > 0){

                    let parent = el._app.for.parent
                //    parent.innerHTML = ''

                    loop(el._app.for.data,0)

                    function loop(data, i){

                        let clones = master[0].cloneNode(true)// master.map((child) => {return child.cloneNode(true)})

                        clones = [clones, ...clones.querySelectorAll(':scope *')]

                        let first = i==0,
                            last = i==el._app.for.data.length-1

                        parseIndex(el._app.for.scope_obj, clones, i, first, last).then((clone) => {
 
                            parent.appendChild(clone[0])
                            el._app.for.children.push(clone[0])

                            i++
                            if (i < data.length){ // if there's more data to process, start the next one
                                loop(data,i)
                            } else { // otherwise stop the loop
                                delete window.update_loops[el._app.for.scope_obj]
                                view.update(el._app.for.scope_obj,true)
                            }

                        })
                    }

                }

            })


        })

        function parseAttributes(elements, scope, obj){

            obj = obj+'[i]'

            let re = new RegExp(scope+"(?=([^']*'[^']*')*[^']*$)") // don't match the scope word when it's in quotes

            return new Promise((resolve, reject) => {

                elements.forEach((element, i) => {

                    if (element.attributes.length > 0){
                        for (var ii = 0; ii < element.attributes.length; ii++) {

                            if (element.attributes[ii].nodeName.startsWith(app.prefix)){

                                var attr = element.attributes[ii]
                                attr.nodeValue = attr.nodeValue.replace(re, obj)

                            }
                        }
                    }

                    if (i >= elements.length-1){
                        resolve(elements)
                    }

                })

            })

        }

        function parseIndex(scope_obj, elements, idx, first, last){

            return new Promise((resolve, reject) => {

                elements.forEach((element, i) => {

                    if (element.attributes.length > 0){
                        for (var ii = 0; ii < element.attributes.length; ii++) {

                            if (element.attributes[ii].nodeName.startsWith(app.prefix)){

                                element.attributes[ii].nodeValue = element.attributes[ii].nodeValue.replace(/\[[0-9i]+\]/,'['+idx+']')
                                                                        .replace(/\$index/g,idx)
                                                                        .replace(/\$first/g,first)
                                                                        .replace(/\$last/g,last)

                                if (element.attributes[ii].nodeName == 'app-if'){

                                    let result = new Evaluate(element.attributes[ii].nodeValue).value()

                                    if (result === false){
                                        element.remove()
                                    //    element._delete = true
                                        continue
                                    }
                                }

                                if (!element._app){
                                    element._app = {
                                        keys:[scope_obj]
                                    }
                                }
                                element._app.scope_obj = scope_obj

                                new Index(element.attributes[ii].nodeValue, element, element.attributes[ii].nodeName, idx)

                            }

                            if (ii >= elements.length-1){
                            //    resolve(elements)
                            }

                        }
                    }

                    if (i >= elements.length-1){
                        resolve(elements)
                    }

                })


            })



        }

    }

    export default forLoop
