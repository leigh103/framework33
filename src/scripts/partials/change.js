
    const change = (evt) => {

        let el = evt.target,
            result = new Evaluate(el._app.change.exp).value(evt)

    }

    module.exports = change
