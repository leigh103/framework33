    import click from './click'

    const forLoop = (el) => {

        if (el._app.for.children){
            el._app.for.children = el._app.for.children.filter((child,i)=>{
                index.deIndex(child)
                child.remove()
                return false
            })
        }

        el._app.for.data = evaluate.getValue(el._app.for.scope_obj)

        if (Array.isArray(el._app.for.data)){

            let parent = el._app.for.parent

            el._app.for.data.map((item,i)=>{

                let clone = el.cloneNode(true),
                    clone_path = index.parsePath([el._app.for.scope_obj,i])

                clone.removeAttribute('style')
                clone.removeEventListener('mouseup',click)

                let for_children = view.domSearch(clone, function(element) {

                    if (typeof element.attributes == 'object'){

                        for (var ii=0; ii < element.attributes.length; ii++){

                            let attr = element.attributes[ii]

                            if (attr.nodeName.startsWith(app.prefix)){

                                let re = new RegExp('^'+el._app.for.obj,'ig'),
                                    re_arr = new RegExp('(\\(|,|\\[)\\s+'+el._app.for.obj+'\\s+(\\]|,|\\))','ig'),
                                    re_scope = new RegExp('scope\\.[a-zA-Z0-9_.\\[\\]]+'),
                                    clone_child_key = attr.nodeValue,//.replace(re, clone_path),
                                    clone_child_key_idx,
                                    item_obj_ref,
                                    obj_refs,
                                    old = {},
                                    first = i==0,
                                    last = i==el._app.for.data.length-1
                                    // if (clone_child_key.match(/edit/)){
                                    //     console.log(clone_child_key)
                                    // }

                                if (re_scope.test(clone_child_key)){ // if a scope value is detected, get value from scope

                                    let scope_match = clone_child_key.match(re_scope),
                                        key_re = RegExp(scope_match[0],'i'),
                                        scope_val = window.evaluate.getValue(scope_match[0].replace(/^scope./,''))

                                    clone_child_key = clone_child_key.replace(key_re,scope_val)

                                }

                                clone_child_key_idx = clone_child_key

                                obj_refs = new Evaluate(clone_child_key_idx).findObjRef()
                                clone_child_key_idx = obj_refs[obj_refs.length-1]

                                if (re_arr.test(clone_child_key_idx)){ // if the loop obj is inside of an array index, just replace the number

                                    clone_child_key_idx = clone_child_key_idx.replace(re_arr,'['+i+']')
                                    clone_child_key = clone_child_key_idx

                                } else {

                                    let key_re = RegExp(clone_child_key_idx)

                                    if (clone_child_key_idx && typeof clone_child_key_idx == 'string'){
                                        clone_child_key_idx = clone_child_key_idx.replace(re,clone_path)
                                    }
                                    clone_child_key = clone_child_key.replace(key_re,clone_child_key_idx)

                                }

                                if (attr.nodeName == 'app-if'){

                                    let result = new Evaluate(clone_child_key).value()

                                    if (!result){

                                        element.style.display = 'none'
                                        element.innerHTML = ''
                                        break
                                    }

                                }

                                clone_child_key = clone_child_key.replace(/\$index/g,i).replace(/\$first/g,first).replace(/\$last/g,last).replace(/\$parent/g,el._app.for.scope_obj).replace(/undefined/g,'')
                                // item_obj_ref = obj_refs[0].replace(re, '').replace(/^\./,'')

                                let new_idx = new Index(clone_child_key, element, attr.nodeName,el._app.for.scope_obj,i)

                                new_idx.init(function(){ // once the index has been set, run the following

                                    if (clone_child_key_idx){
                                        view.update(clone_child_key_idx)
                                    }

                                })


                            }

                        }

                    }

                })

                el._app.for.children.push(clone)

                clone.style.display = el._app.display

                clone.removeAttribute(app.prefix+'for')
                parent.appendChild(clone)

            })


        }


    }

    export default forLoop
