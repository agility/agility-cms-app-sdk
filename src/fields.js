import types from './types'
import { getMessageID } from './utils';
import { listenForCMS, notifyCMS } from './messages';

const updateFieldValue = function ({ fieldName, fieldValue }) {
    var messageID = getMessageID({
        location: this.location,
        fieldName: this.fieldName,
        fieldID: this.fieldID
    });

    if(!fieldName) {
        fieldName = this.fieldName;
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
        fieldID: this.fieldID,
        fieldName: this.fieldName
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

     listenForCMS({ messageChannel: `closeFlyoutCallback_for_${messageID}`}).then((message) => {
         onClose(message);
     });
}



const subscribeToFieldValueChanges = function ({ fieldName, onChange}) {
    
    const messageID = getMessageID({
        fieldID: this.fieldID,
        fieldName: this.fieldName,
        location: this.location
    });
    
    listenForCMS({ 
        messageChannel: `otherValueChanged_${fieldName}_for_${messageID}`,
        persist: true
     }).then((message) => {
         onChange(message);
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