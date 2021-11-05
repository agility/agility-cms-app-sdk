
const notifyCMS = ({ message, messageChannel}) => {
    if (window.parent) {
        window.parent.postMessage({
            message: message,
            type: messageChannel
        }, "*")
    }
}

const listenForCMS = ({ messageChannel, persist = false }) => {
    return new Promise(resolve => {
        var listener = function (e) {
        
            //only care about these messages
            if(e.data.type === messageChannel) {
                if(!persist) {
                    removeEventListener("message", listener, false);
                }
                resolve(e.data.message);
                return;
            
            }
        }
    
        window.addEventListener("message", listener, false);
    })
    
}

export {
    notifyCMS,
    listenForCMS
}