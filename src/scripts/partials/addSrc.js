
    export default function addSrc(el, data){

        var el_prop = el.getAttribute('app-src'),
            src_url = app.methods.getValue(scope, el_prop)

        if (typeof data == 'string' && data.match(/png|jpg|jpeg|svg|mp4|m4v$/)){
            el.setAttribute('src',data)
        } else if (typeof src_url == 'string' && src_url.match(/png|jpg|jpeg|svg|mp4|m4v$/)) {
            el.setAttribute('src',src_url)
        }

        app.methods.addIndex(el, el_prop, 'src')

    }
