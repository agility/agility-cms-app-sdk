import { getMessageID } from "./utils";
import types from "./types";
import { notifyCMS } from "./messages";

const closeFlyout = function ({ params }) {
    const location = types.APP_LOCATION_CUSTOM_FIELD;
    const messageID = getMessageID({ 
        location,
        fieldID: this.fieldID,
        fieldName: this.fieldName
    })

    notifyCMS({ 
        message: {
            location, 
            fieldName: this.fieldName,
            fieldID: this.fieldID,
            params
        },
        messageChannel: `closeFlyout_for_${messageID}`
    })
    
}

export {
    closeFlyout
}