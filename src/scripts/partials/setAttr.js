
    const setAttr = (el) => {

        let new_attr = new Evaluate(el._app.attr.exp).value()

        // if (Array.isArray(new_attr)){
        //     new_attr = new_attr[0]
        // }

        if (Array.isArray(new_attr)){
            el.setAttribute(new_attr[0], new_attr[1])
        } else if (el._app.attr && el._app.attr.attr_name){
            el.setAttribute(el._app.attr.attr_name,new_attr)
        } else {
            el.removeAttribute(el._app.attr.attr_name)
        }

    }

    module.exports = setAttr
