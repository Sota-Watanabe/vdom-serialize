var VNode = require('virtual-dom/vnode/vnode');
var VPatch = require('virtual-dom/vnode/vpatch');
var VText = require('virtual-dom/vnode/vtext');

module.exports.serializePatches = function(obj){

    obj = iterate(obj)


    return obj;
};

module.exports.deserializePatches = function(obj){

    for ( prop in obj ){
        obj[prop] = CreateNode(obj[prop]);
    }
    return obj;
};

function CreateNode(obj){
    var node = '';
    if ( obj['#type']) {
        if (obj['#type'] == 'VirtualPatch') {
            obj.patch = CreateNode(obj.patch)
            node = new VPatch(obj.type, obj.vNode, obj.patch);
            return node;
        }
        else if (obj['#type'] == 'VirtualText') {
            node = new VText(obj.text);
            return node;
        }
        else if (obj['#type'] == 'VirtualNode') {
            var children = [];
            for (child in obj.children) {
                children.push(CreateNode(obj.children[child]))
            }
            node = new VNode(obj.tagName, obj.properties, children);
            return node;
        }
    }
    else if (Array.isArray(obj)){
        var arr = [];
        for ( var i in obj ){
            arr.push(CreateNode(obj[i]))
        }
        obj = arr;
    }
    return obj;
}

function iterate(obj){
    for ( prop in obj ){
        if (Array.isArray(obj[prop])){
            obj[prop] = iterate(obj[prop])
        }
        else{
            if (obj[prop] && obj[prop].constructor && (
                obj[prop].constructor.name == 'VirtualNode' ||
                obj[prop].constructor.name == 'VirtualPatch' ||
                obj[prop].constructor.name == 'VirtualText')){
                console.log("found node: " + obj[prop].constructor.name)
                obj[prop]['#type'] = obj[prop].constructor.name;
                obj[prop] = iterate(obj[prop])
            }
        }
    }

    return obj;
}