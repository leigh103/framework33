export default function updateCheckedElement(el, data){

    if (!data){
        data = scope
    }

    let attr = el.getAttribute('app-checked'),
        val = app.methods.getValue(data, attr)

    if (val){
        el.checked = true
    } else {
        el.checked = false
    }

}
