
    const init = (el) => {


        let str
        
        if (el._app.init){
            str = new Evaluate(el._app.init.exp).value(el)
        } else if (el._app['init-scroll']){
            str = new Evaluate(el._app['init-scroll'].exp).value(el)
        }
        

    }

    module.exports = init
