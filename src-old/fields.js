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
    openFlyout
}