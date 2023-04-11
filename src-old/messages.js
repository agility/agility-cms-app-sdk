
const notifyCMS = ({ message, messageChannel}) => {
    if (window.parent) {
        window.parent.postMessage({
            message: message,
            type: messageChannel
        }, "*")
    }
}

const listenForCMS = ({ messageChannel, onMsgReceived, persist = false }) => {
    var listener = function (e) {
        
        //only care about these messages
        if(e.data.type === messageChannel) {
            if(!persist) {
                removeEventListener("message", listener, false);
            }
            onMsgReceived(e.data.message);
            return;
        
        }
    }

    window.addEventListener("message", listener, false);
}

export {
    notifyCMS,
    listenForCMS
}