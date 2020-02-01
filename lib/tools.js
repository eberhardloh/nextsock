const findByKey = (inObj, inKey, value) => {
    let r = null;
    if(Object.keys(inObj).length) {
        Object.keys(inObj).forEach((currentValue, index) => {
            if(inObj[currentValue][inKey] == value) {
                r = currentValue;
            }
        });
    }
    return r;
}

const getParams = (key = '') => {
    let s = location.search.substring(1);
    if(s) {
        let obj = JSON.parse('{"' + s.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });
        return key ? (obj[key] ? obj[key] : null) : obj;
    } else {
        return null;
    }
}

module.exports = {
    findByKey: findByKey,
    getParams: getParams
}
