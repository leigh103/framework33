
    export default function addSrc(el, data){

        var el_prop = el.getAttribute('app-src'),
            src_url = app.methods.getValue(scope, el_prop)

        if (data && typeof data == 'string'){
            el.setAttribute('src',data)
        } else if (src_url && typeof src_url == 'string') {
            el.setAttribute('src',src_url)
        } else if (el.hasAttribute('app-placeholder')){
            let placeholder = el.getAttribute('app-placeholder')
            el.setAttribute('src',placeholder)
        } else {
            el.setAttribute('src','')
        }

        app.methods.addIndex(el, el_prop, 'src')

    }
