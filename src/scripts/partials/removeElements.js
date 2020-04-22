export default function removeElements(className, el, callback){

    if (!className.match(/^\./)){
        className = '.'+className
    }

    if (el){
        var els = el.querySelectorAll(className)
    } else {
        var els = document.querySelectorAll(className)
    }


    if (els.length > 0){

        for (let i in els){

            if (els[i].parentNode){
                els[i].parentNode.removeChild(els[i])
            }

            if (i >= els.length-1){
                if (callback){
                    callback()
                }
            }

        }

    } else {
        if (callback){
            callback()
        }
    }

}
