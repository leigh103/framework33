export default function toggleElement(el, type, obj){

    if (!obj){
        obj = scope
    }

    if (type == 'show'){

        let el_prop = el.getAttribute('app-show'),
            val = app.methods.getValue(obj, el_prop),
            anim_children = el.querySelector('[anim]'),
            has_anim = el.hasAttribute('anim')
        //    console.log(obj, el_prop, val)

        if (val){ // show


            if (anim_children && anim_children.length > 0){

                for (let i=0; i<anim_children.length;i++){
                    anim_children[i].classList.remove('exit-view')
                    anim_children[i].classList.add('in-view')
                }

            } else if (anim_children) {
                anim_children.classList.remove('exit-view')
                anim_children.classList.add('in-view')
            }

            if (has_anim){
                el.classList.remove('exit-view')
                el.classList.add('in-view')
            }

            if (el.classList.contains('grid')){
                el.style.display = 'grid'
            } else if (el.classList.contains('btn')){
                el.style.display = 'inline-flex'
            } else if (el.className.match(/flex|modal|notification/)){
                el.style.display = 'flex'
            } else if (el.tagName == 'SPAN'){
                el.style.display = 'inline'
            } else {
                el.style.display = 'block'
            }

        } else { // hide

            if (anim_children && anim_children.length > 0){

                for (let i=0; i<anim_children.length;i++){
                    anim_children[i].classList.remove('in-view')
                    anim_children[i].classList.add('exit-view')
                }

            } else if (anim_children) {
                anim_children.classList.remove('in-view')
                anim_children.classList.add('exit-view')
            }

            if (has_anim){

                let duration = 500

                if (el.hasAttribute('anim-duration')){
                    duration = el.getAttribute('anim-duration')
                }

                el.classList.remove('in-view')
                el.classList.add('exit-view')

                setTimeout(function(){
                    el.style.display = 'none'
                },duration)

            } else {
                el.style.display = 'none'
            }

        }

    } else if (type == 'hide'){

        var el_prop = el.getAttribute('app-hide'),
            val = app.methods.getValue(obj, el_prop),
            anim_children = el.querySelector('[anim]'),
            has_anim = el.hasAttribute('anim')

        if (val){ // hide

            // el.style.display = 'none'
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

            if (has_anim){
                let duration = 500

                if (el.hasAttribute('anim-duration')){
                    duration = el.getAttribute('anim-duration')
                }

                el.classList.remove('in-view')
                el.classList.add('exit-view')

                setTimeout(function(){
                    el.style.display = 'none'
                },duration)
            } else {
                el.style.display = 'none'
            }

        } else { // show

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

            if (has_anim){
                el.classList.remove('exit-view')
                el.classList.add('in-view')
            }

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

        }

    } else {

        var el_prop = el.getAttribute('app-if'),
            val = app.methods.getValue(obj, el_prop),
            anim_children = el.querySelector('[anim]'),
            has_anim = el.hasAttribute('anim'),
            index = [...app.elements.logic.nodes].indexOf(el)

        if (val){ // if

            let div = document.querySelector('[app-replace="'+index+'"]')

            if (div){
                div.parentNode.replaceChild(el,div)
            }

            el.classList.add('in-view')

        } else {

            let div = document.querySelectorAll('[app-replace="'+index+'"]')[0]

            if (div){
                // div.parentNode.replaceChild(el,div)
            } else {
                div = document.createElement("div")
                div.setAttribute('app-replace',index)
                el.parentNode.replaceChild(div,el)
            }

            el.classList.remove('exit-view')

        }

    }

}
