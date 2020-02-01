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

/*
parameter by position (number): getParams('[1]') = first (not zero)
*/
const getParams = (key = '') => {
    let s = location.search.substring(1);
    if(s) {
        if(key.match(/^\[\d+\]$/)) {
            s = s.split('&');
            key = parseInt(key.replace(/^.(.*).$/, '$1')) - 1;
            return s[key] ? s[key] : null;
        } else {
            // 1st & 2nd replace eliminate '&value', alternatively it could replace with '$1$2=$2' for value=value
            let obj = JSON.parse('{"' + s.replace(/(^|&)([^&=]+)(?=&|$)/g, '').replace(/^&/, '').replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });
            return key ? (obj[key] ? obj[key] : null) : obj;
        }
    } else {
        return null;
    }
}

module.exports = {
    findByKey: findByKey,
    getParams: getParams
}
