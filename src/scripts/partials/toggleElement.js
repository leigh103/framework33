export default function toggleElement(el, type, obj){

    if (!obj){
        obj = scope
    }

    if (type == 'show'){

        let el_prop = el.getAttribute('app-show'),
            val = app.methods.getValue(obj, el_prop),
            anim_children = el.querySelector('[anim]')
        //    console.log(obj, el_prop, val)

        if (val){

            if (el.classList.contains('grid')){
                el.style.display = 'grid'
            } else if (el.classList.contains('btn')){
                el.style.display = 'inline-flex'
            } else if (el.classList.contains('flex') || el.classList.contains('modal')){
                el.style.display = 'flex'
            } else if (el.tagName == 'SPAN'){
                el.style.display = 'inline'
            } else {
                el.style.display = 'block'
            }

            el.classList.add('in-view')

            if (anim_children && anim_children.length > 0){

                for (let i=0; i<anim_children.length;i++){
                    anim_children[i].classList.remove('exit-view')
                    anim_children[i].classList.add('in-view')
                }

            } else if (anim_children) {
                anim_children.classList.remove('exit-view')
                anim_children.classList.add('in-view')
            }

        } else {

            el.style.display = 'none'
            el.classList.remove('in-view')

            if (anim_children && anim_children.length > 0){

                for (let i=0; i<anim_children.length;i++){
                    anim_children[i].classList.remove('in-view')
                    anim_children[i].classList.add('exit-view')
                }

            } else if (anim_children) {
                anim_children.classList.remove('in-view')
                anim_children.classList.add('exit-view')
            }

        }

    } else if (type == 'hide'){

        var el_prop = el.getAttribute('app-hide'),
            val = app.methods.getValue(obj, el_prop),
            anim_children = el.querySelector('[anim]')

        if (val){

            el.style.display = 'none'
            el.classList.remove('in-view')

            if (anim_children && anim_children.length > 0){

                for (let i=0; i<anim_children.length;i++){
                    anim_children[i].classList.remove('in-view')
                    anim_children[i].classList.add('exit-view')
                }

            } else if (anim_children) {
                anim_children.classList.remove('in-view')
                anim_children.classList.add('exit-view')
            }

        } else {

            if (el.classList.contains('grid')){
                el.style.display = 'grid'
            } else if (el.classList.contains('btn')){
                el.style.display = 'inline-flex'
            } else if (el.classList.contains('flex') || el.classList.contains('modal')){
                el.style.display = 'flex'
            } else if (el.tagName == 'SPAN'){
                el.style.display = 'inline'
            } else {
                el.style.display = 'block'
            }

            el.classList.add('in-view')

            if (anim_children && anim_children.length > 0){

                for (let i=0; i<anim_children.length;i++){
                    anim_children[i].classList.remove('exit-view')
                    anim_children[i].classList.add('in-view')
                }

            } else if (anim_children) {
                anim_children.classList.remove('exit-view')
                anim_children.classList.add('in-view')
            }

        }

    } else {

        var el_prop = el.getAttribute('app-if')

        // if (scope[el_prop]){
        //
        //     let index = [...app.elements.logic.nodes].indexOf(el)
        //     let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]
        //     div.parentNode.replaceChild(el,div)
        //
        // } else if (el_prop.match(/==|\!=|^!/)){
        //
        //     app.methods.evaluateProp(el_prop, function(test){
        //
        //         if (test === false){
        //             if (el.parentNode){
        //                 let div = document.createElement("div")
        //                 div.setAttribute('app-replace',[...app.elements.logic.nodes].indexOf(el))
        //                 el.parentNode.replaceChild(div,el)
        //             }
        //         } else {
        //             let index = [...app.elements.logic.nodes].indexOf(el)
        //             let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]
        //             if (div){
        //                 div.parentNode.replaceChild(el,div)
        //             }
        //
        //         }
        //     })
        //
        // } else {
        //
        //     let index = [...app.elements.logic.nodes].indexOf(el)
        //     let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]
        //
        //     if (div){
        //         div.parentNode.replaceChild(el,div)
        //     }
        //
        // }

    }

}
