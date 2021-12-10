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
    let previousHeight = 0;

    setInterval(function() {
        const currentHeight = containerRef.current ? containerRef.current.offsetHeight : containerRef.offsetHeight;

        if(currentHeight != previousHeight) {
            console.log('height changed!');
            updateFieldHeight({
                height: currentHeight,
                messageID
            });
        }

        previousHeight = currentHeight;

    }, 500)
}


export {
    getUrlParameter,
    getMessageID,
    autoSyncFieldHeight
}