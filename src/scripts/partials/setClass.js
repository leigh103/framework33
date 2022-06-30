
    const setClass = (el) => {
        
        if (typeof el._app.original_classes == 'undefined'){
            el._app.original_classes = el.className+''
        } else {
            el.className = el._app.original_classes
        }

        let new_class = new Evaluate(el._app.class.exp).value()

        
       
        if (Array.isArray(new_class)){

          //  new_class = new_class.toString().split(/\s/)
            if (el._app.class && el._app.class.key_type == 'comparison_class'){
                new_class.pop()
            }

            new_class.map((item)=>{
                
                if (!el.classList.contains(item) && /-?(?:[_a-z]|[\200-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])(?:[_a-z0-9-]|[\200-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])*/.test(item)){
                    el.classList.add(item)
                }
            })

        } else if (typeof new_class != 'undefined') {

            new_class = new_class.toString().split(/\s|,/)

            new_class.map((item)=>{
                if (typeof item == 'string' && item.length > 0 && !el.classList.contains(item) && /-?(?:[_a-z]|[\200-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])(?:[_a-z0-9-]|[\200-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])*/.test(item)){
                    el.classList.add(item)
                }
            })

        } else if (el._app.original_classes) {
            el.className = el._app.original_classes
        }

    }

    module.exports = setClass
