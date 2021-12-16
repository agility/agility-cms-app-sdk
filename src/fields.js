import types from './types'
import { getMessageID } from './utils';
import { listenForCMS, notifyCMS } from './messages';

const updateFieldValue = function ({ fieldName, fieldValue }) {
    
    var messageID = getMessageID({
        location: this.location,
        initiator: this.initiator,
        id: this.id
    });

    if(!fieldName) {
        fieldName = this.field.name;
    }

    notifyCMS({ 
        message: {
            fieldName,
            fieldValue
        } ,
        messageChannel: `setNewValue_for_${messageID}`
    })

}

const getContentItem = async function() {
    return new Promise((resolve, reject) => {
        let contentItemReceived = false;

        const messageID = getMessageID({
            location: types.APP_LOCATION_CUSTOM_FIELD,
            initiator: this.initiator,
            id: this.id
         });
    
         notifyCMS({
            message: null, //no specific values required
            messageChannel: `getContentItem_for_${messageID}`
         })
    
         listenForCMS({
             messageChannel: `getContentItemCallback_for_${messageID}`,
             onMsgReceived: (contentItem) => {
                 contentItemReceived = true;
                resolve(contentItem)
             }
         })

         setTimeout(() => {
            if(!contentItemReceived) {
                reject("CMS did not reply with a contentItem.")
            }
         }, 3000); //wait 3 seconds before cancelling
    })
}

const openFlyout = function ({title, size, name, onClose, params }) {
    const messageID = getMessageID({
        location: types.APP_LOCATION_CUSTOM_FIELD,
        initiator: this.initiator,
        id: this.id
     });

    notifyCMS({
        message: {
        title,
        size,
        name,
        params
        },
        messageChannel: `openFlyout_for_${messageID}`
    })

    listenForCMS({ 
        messageChannel: `closeFlyoutCallback_for_${messageID}`,
        onMsgReceived: (message) => onClose(message)
    });

}



const subscribeToFieldValueChanges = function ({ fieldName, onChange}) {
    
    const messageID = getMessageID({
        location: types.APP_LOCATION_CUSTOM_FIELD,
        initiator: this.initiator,
        id: this.id
    });
    
    listenForCMS({ 
        messageChannel: `otherValueChanged_${fieldName}_for_${messageID}`,
        persist: true,
        onMsgReceived: (message) => onChange(message)
    })

    notifyCMS({ 
        message: fieldName,
        messageChannel: `subscribeToOtherValueChanges_${messageID}`
    });
}


export  {
    updateFieldValue,
    subscribeToFieldValueChanges,
    openFlyout,
    getContentItem
}