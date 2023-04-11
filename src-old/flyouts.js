import { getMessageID } from "./utils";
import types from "./types";
import { notifyCMS } from "./messages";

const closeFlyout = function ({ params }) {
    const location = types.APP_LOCATION_CUSTOM_FIELD;

    //Special Case: message ID must match the custom field's ID that called it
    const messageID = getMessageID({ 
        location: types.APP_LOCATION_CUSTOM_FIELD,
        initiator: {
            name: 'system',
            id: null
        },
        id: this.initiator.id
    })

    notifyCMS({ 
        message: {
            location, 
            fieldName: this.initiator.name,
            fieldID: this.initiator.id,
            params
        },
        messageChannel: `closeFlyout_for_${messageID}`
    })
    
}

export {
    closeFlyout
}