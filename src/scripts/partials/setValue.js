export default function setValue(obj, path, val) {

    path = path.replace(/__([0-9]+)__/g,'[$1].')
    _.set(obj, path, val)

}
