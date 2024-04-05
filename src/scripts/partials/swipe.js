const swipe = (el) => {
        
    if (scope.view._swipe_enabled === true){
        return false
    } else {
        scope.view._swipe_enabled = true
    }



    // let el = evt.target,
    //     right_click = false

    // if (typeof evt.stopPropagation == 'function'){
    //     evt.stopPropagation()
    // }

    // if (el && !el._app || el && el._app && !el._app.swipe){
    //     el = el.parentNode
    //     evt._parentNode = el
    // }

    // if (el && !el._app || el && el._app && !el._app.swipe){
    //     el = el.parentNode
    //     evt._parentNode = el
    // }

    el.addEventListener("touchstart", startTouch, false);
    el.addEventListener("touchmove", moveTouch, false);

    // Swipe Up / Down / Left / Right
    var initialX = null;
    var initialY = null;

    function startTouch(e) {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
    };

    function moveTouch(e) {

        if (initialX === null) {
            return;
        }

        if (initialY === null) {
            return;
        }

        var currentX = e.touches[0].clientX;
        var currentY = e.touches[0].clientY;

        var diffX = initialX - currentX;
        var diffY = initialY - currentY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
                // sliding horizontally
            if (diffX > 0) {
                // swiped left
                console.log("swiped left");
            } else {
                // swiped right
                console.log("swiped right");
            }  
        } else {
            // sliding vertically
            if (diffY > 0) {
                // swiped up
                console.log("swiped up");
            } else {
                // swiped down
                console.log("swiped down");
            }  
            
        }

        initialX = null;
        initialY = null;

        e.preventDefault();
    }

}

module.exports = swipe