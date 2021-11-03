import locations from './locations'
import { getMessageID } from './utils';

const updateFieldValue = function ({ fieldName, fieldValue }) {
    var messageID = getMessageID({
        location: this.location,
        fieldName: this.fieldName,
        fieldID: this.fieldID
    });

    if(!fieldName) {
        fieldName = this.fieldName;
    }

    if (window.parent) {
        window.parent.postMessage({
            message: {
                fieldName,
                fieldValue
            },
            type: `setNewValue_for_${messageID}`
        }, "*")
      } else {
        console.log(`${messageID} => 😞 Can't post message to parent.`)
      }
}

const openFlyout = function ({title, size, name, onClose, params }) {
    const messageID = getMessageID({
        location: locations.APP_LOCATION_CUSTOM_FIELD,
        fieldID: this.fieldID,
        fieldName: this.fieldName
     });

    if (window.parent) {
        window.parent.postMessage({
            message: {
                title,
                size,
                name,
                params
            },
            type: `openFlyout_for_${messageID}`
        }, "*")

        var listener = function(e) {
            if(e.data.type === `closeFlyoutCallback_for_${messageID}`) {
                onClose(e.data.message);
            }
            window.removeEventListener("message", listener, false);
        };

        window.addEventListener("message", listener, false)
    }
}

const closeFlyout = function ({ params }) {
    const location = locations.APP_LOCATION_CUSTOM_FIELD;
    const messageID = getMessageID({ location, fieldID: this.fieldID, fieldName: this.fieldName})
    if (window.parent) {
        window.parent.postMessage({
            message: {
                location,
                fieldName: this.fieldName,
                fieldID: this.fieldID,
                params
            },
            type: `closeFlyout_for_${messageID}`
        }, "*")
    }
}




const subscribeToFieldValueChanges = function ({ fieldName, onChange}) {
    
    const messageID = getMessageID({ fieldID: this.fieldID, fieldName: this.fieldName, location: this.location })
    //open a channel to listen to messages from the CMS when field values change
    window.addEventListener("message", function (e) {
        //only care about these messages
        if(e.data.type === `otherValueChanged_${fieldName}_for_${messageID}`) {
            onChange(e.data.message);
        }
    }, false);

    //let the CMS know we are NOW ready to receive messages
    if (window.parent) {
        window.parent.postMessage({
            message: fieldName,
            type: `subscribeToOtherValueChanges_${messageID}`
        }, "*")
    } else {
        console.log(`${messageID} => 😞 Parent window not found. You must load this within Agility CMS as an iFrame.`)
    }
}


export  {
    updateFieldValue,
    subscribeToFieldValueChanges,
    openFlyout,
    closeFlyout
}