
export default function addClass(el, class_name, data){

    var el_prop = el.getAttribute('app-class'),
        orig_class_list = el.getAttribute('app-orig-class')

    if (!class_name){
        if (el.scoped_data){
            class_name = app.methods.getValue(el.scoped_data, el_prop)
        } else {
            class_name = app.methods.getValue(scope, el_prop)
        }
    }

    if (class_name && class_name != 'false'){
        el.classList.add(class_name)
        el.setAttribute('app-added-class',class_name)
    } else {
        let remove_class = el.getAttribute('app-added-class')
        el.classList.remove(remove_class)
        el.removeAttribute('app-added-class')
    }

    // if (!el.getAttribute('app-initial')){
    //     orig_class_list = el.classList.value
    //     el.setAttribute('app-orig-class',orig_class_list.replace(/app\-hidden|in\-view|exit\-view/,''))
    // }
    //
    // if (orig_class_list){
    //     el.className = orig_class_list
    // } else {
    //     el.className = ''
    // }
    //
    // if (class_name){
    //     el.classList.add(class_name)
    // }
    //
    // el.setAttribute('app-initial',true)

    app.methods.addIndex(el, el_prop, 'class')

}
