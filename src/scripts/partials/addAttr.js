
    export default function addAttr(el, data){

        if (!data){
            data = scope
        }

        var el_prop = el.getAttribute('app-attr'),
            el_prop_arr,
            val,
            attr_name

        // if (el_prop.match(regex.logic_class)){
        //
        //     val = app.methods.getValue(data, el_prop)
        //     attr_name = el_prop.match(regex.logic_class)[1]
        //
        //     if (typeof val != 'undefined'){
        //         el.setAttribute(attr_name, 'true')
        //     } else {
        //         el.removeAttribute(attr_name)
        //     }
        // } else if (el_prop.match(regex.logic_function)){
        //
        //     val = app.methods.getValue(data, el_prop.match(regex.logic_function)[2])
        //     attr_name = el_prop.match(regex.logic_function)[1]
        //
        //     if (typeof val == 'undefined' || val == false || val == 'false'){
        //         el.removeAttribute(attr_name)
        //     } else {
        //         el.setAttribute(attr_name, 'true')
        //     }
        //
        // } else {

            if (el_prop){
                el_prop_arr = el_prop.replace(/{/,'').replace(/}/,'').split(',')
            }

            for (let i in el_prop_arr){

                let attr = el_prop_arr[i].split(':')[0],
                    attr_val = el_prop_arr[i].split(':')[1],
                    prefix = '',
                    postfix = '',
                    val

                if (attr_val && attr_val.match(/'(.*?)'\+(.*?)/)){
                   prefix = attr_val.split('+')
                   attr_val = prefix[1]
                   prefix = prefix[0].replace(/'/g,'')
               } else if (attr_val && attr_val.match(/(.*?)\+'(.*?)'/)){
                   prefix = attr_val.split('+')
                   attr_val = prefix[0]
                   prefix = prefix[1].replace(/'/g,'')
                }

                val = app.methods.getValue(data, attr_val)

                el.setAttribute(attr.replace(/'/g,''), prefix+val+postfix)

            }

        // }



        app.methods.addIndex(el, el_prop, 'attr')

    }
