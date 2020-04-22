export default function updateModelElement(el, data){

    if (typeof data == 'object'){

        let attr = el.getAttribute('app-index').replace(/__/g,'.').replace(/\.([0-9]+)/,'[$1]'),//.replace(/^(.*?)\./,''),
            val = _.get(scope, attr)

        if (typeof val != 'undefined'){
            el.value = val
        } else {
            el.value = ''
        }

    } else {
        el.value = data
    }

}
