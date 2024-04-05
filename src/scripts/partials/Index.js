
    import click from './click'
    import _get from 'lodash.get'
    import init from './init'

    export default class Index {

        constructor(key, el, type, idx) {

            if (typeof type == 'string'){
                type = type.replace(window.app.prefix_regex, '')
            }

            let length_key = false

            if (!key || !el || !type){
                return false
            } else if (el && !el._app){
                el._app = {
                    keys:[],
                    renders:{}
                }
            }

            if (parseInt(idx) >= 0){
                el._app.index = idx
            }

            type = this.parseType(type)

            // if (key && key.match(/length/)){
            //     key = key.replace('.length','')
            //     length_key = true
            // }

            let keys = this.getKeys(key)
            el._app.keys = el._app.keys.concat(keys.keys)

            if (type == 'for'){

                // let clone = {el:el.cloneNode(true),parent:el.parentNode}
                // clone.el.removeAttribute('app-for')

                //
                // el = clone.el

            //    el.removeAttribute('app-for')

                let statement = this.parseAppFor(key)

                el._app.keys.push(statement[1])

                el._app[type] = key

                el._app.for = {
                    keys: keys.keys,
                    key_type: keys.key_type,
                    obj: statement[0],
                    scope_obj: statement[1],
                    children:[],
                    parent: el.parentNode
                }

                el.remove()

                window.app.for.push({el:el, keys:keys.keys})

            //    return

            } else if (type == 'attr'){

                el._app.attr = {
                    exp: key,
                    key_type: keys.key_type,
                    keys:keys.keys.splice(1,1),
                    attr_name:keys.keys[0]
                }

            } else if (type == 'if'){

                el._app[type] = {
                    exp: key,
                    key_type: keys.key_type,
                    keys:keys.keys,
                    parent: el.parentNode,
                    parent_index: Array.from(el.parentNode.childNodes).indexOf(el)
                }

            } else {

                if (keys.keys.length == 0 && el._app.scope_obj){
                    keys.keys = [el._app.scope_obj]
                }

                el._app[type] = {exp: key, key_type: keys.key_type, keys:keys.keys}

            }

            if (el._app[type].key_type == 'function_call'){

                let functionCall = key.match(evaluate.regex.function)

                el._app.functionCall = {
                    name: functionCall[1],
                    params: functionCall[2]
                }


            }

            if (type == 'click'){
                el.removeEventListener('click', click)
                el.addEventListener('click', click)
            }

            if (type == 'init'){
                window.app.init.push(el)
            }

            if (length_key === true){
                el._app[type].exp = el._app[type].exp+'.length'
            }

            el._app.keys.map((key)=>{

                let key_root = key,
                    key_matches = key.match(/\./)

                if (key_matches){ // add in the root object index

                    while(/\./.test(key_root)){

                        if (/\]$/.test(key_root)){
                            key_root = key_root.replace(/\[[0-9]+\]$/,'')
                            
                        } else {
                            key_root = key_root.split('.')
                            if (key_root.length > 1){
                                key_root.pop()
                                key_root = key_root.join('.')
                            }
                        }
                        
                        if (!app.index[key_root]){
                            app.index[key_root] = []
                        }
                        
                        let el_obj = {el:el, key:key_root, type:type},
                            exists = app.index[key_root].findIndex(x => x.el === el && x.type == type)

                        if (exists >= 0){
                            app.index[key_root][exists].el = el
                        } else {
                            app.index[key_root].push(el_obj)
                        }

                        if (!el._app[type].keys){
                            el._app[type].keys = []
                        }

                        el._app[type].keys.push(key_root)

                    }

                }

                if (!app.index[key]){
                    app.index[key] = []
                }

                let el_obj = {el:el, key:key, type:type},
                   exists = app.index[key].findIndex(x => x.el === el && x.type == type)

                if (exists >= 0){
                    app.index[key][exists].el = el
                } else {
                    app.index[key].push(el_obj)


                }


            })

            this.el = el._app

        }

        init (callback) {
            callback.apply(this);
        }

        getKeys(key_str){

            let keys = new Evaluate(key_str),
                self = this

            let key_type = keys.type

            keys = keys.findObjRef()

            return {keys:keys, key_type:key_type}

        }

        isObjKey(str){
            return typeof str == 'string' && str.match(evaluate.regex.object_reference)
        }

        getElements(key){
            return app.index[key]
        }

        findElement(key, el){

            return app.index[key].filter((item)=>{
                return item.el == el
            })

        }

        deIndex(el){

            el._app.keys.forEach((key,i)=>{
                if (app.index[key]){

                    app.index[key].filter((idx,ii)=>{
                        return idx.el._app.hasOwnProperty('for')
                    })

                }

            })

            el.remove()

        }

        parseType(type){

            if (typeof type == 'string'){
                return type.replace(app.prefix,'')
            } else {
                return false
            }

        }

        parseKey(key, reverse){

            if (reverse){
                key = key.replace(/\.([0-9]+)./g,'[$1].').replace(/\.([0-9]+)$/g,'[$1]')//.replace(/\__/g,'.')
            } else {
                key = key//.replace(/\[([0-9]+)\]/g,'.$1')
            }
            return key

        }

        parseAppFor(attr){

            return attr.split(/\s+in\s+/)

        }

        parseFunctionCall(key){

            let functionCall = key.match(evaluate.regex.functionCall)

        }

        parsePath(path){

            let result = ''

            path.map((item)=>{

                if (!isNaN(item) || typeof item == 'string' && item.match(/^[0-9]+$/)){
                    result = result.replace(/\.$/,'')+'['+item+'].'
                } else {
                    result += item+'.'
                }

            })

            return result.replace(/\.$/,'')

        }

    }
