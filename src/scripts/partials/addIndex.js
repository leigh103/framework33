export default function addIndex(el, el_prop, key, index){

    if (el_prop.match(/\{\{(.*?)\}\}/)){
        return false
    }

    if (el_prop && el_prop != null){

        el_prop = el_prop.replace(/^!/,'')

        if (el_prop.match(/\sin\s/)){ // if the property is a for loop

            el_prop = el_prop.split(/\sin\s/)[1].replace(/\./g,'__')


        } else if (el_prop.match(regex.logic_class)){

            let matches = el_prop
                matches = matches.match(regex.logic_class),
                el_prop = matches[2]

            app.methods.addIndex(el, matches[4], key)

        } else if (el_prop.match(regex.logic)){ // if the property is an expression, get the object key we need to index

            el_prop = el_prop.split(/\s|==|!=|=|<=|>=|<|>/)[0]

        } else if (el_prop.match(regex.function)){ // if the property is function, get the object key we need to index

            let matches = el_prop.match(/\((.*)\)/)[1]
            el_prop = matches.split(',')[0]

        }

        let orig_el_prop = el_prop+''

        if (el_prop.match(/\./)){ // if nested object, use the route as the index
            let route_el_prop = el_prop.split('.')
            let popped = route_el_prop.pop()
            app.methods.addIndex(el, route_el_prop.join('.'), key)

        }

        el_prop = el_prop.replace(/^[ \t]+|[ \t]+$/,'').replace(/\[/,'__').replace(/\]/,'').replace(/\(|\)/g,'').replace(/\./g,'__')

        if (key == 'foreach'){
            let root_el_prop = el_prop.split('__')[0]
            if (!app.elements[key].index[root_el_prop]){
                app.elements[key].index[root_el_prop] = []
            }

            if (app.elements[key].index[root_el_prop].indexOf(el) === -1){
                app.elements[key].index[root_el_prop].push(el)
            }
        }


        el.setAttribute('app-index',el_prop)

        if (!app.elements[key].index[el_prop]){
            app.elements[key].index[el_prop] = []
        }

        if (app.elements[key].index[el_prop].indexOf(el) === -1){
            app.elements[key].index[el_prop].push(el)
        }

    }

}
