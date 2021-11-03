const getUrlParameter = (name) => {
    //eslint-disable-next-line
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const getMessageID = ({ location, fieldName, fieldID }) => {
    return location + '_' + fieldName + '_' + fieldID;
}

const updateFieldHeight = ({ height, messageID }) => {
    
    if (window.parent) {
        window.parent.postMessage({
            message: height,
            type: `setHeight_for_${messageID}`
        }, "*")
    }
}

const autoSyncFieldHeight = ({ containerRef, messageID }) => {
    setInterval(function() {
        
        updateFieldHeight({
            height: containerRef.current ? containerRef.current.offsetHeight : containerRef.offsetHeight,
            messageID
         });
    }, 500)
}


export {
    getUrlParameter,
    getMessageID,
    autoSyncFieldHeight
}