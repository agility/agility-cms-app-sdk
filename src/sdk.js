const APP_LOCATION_CUSTOM_FIELD = 'CustomField';
const APP_LOCATION_UNKNOWN = 'Unknown';
const APP_LOCATION_APP_CONFIG = 'AppConfig';
const APP_LOCATION_FLYOUT = 'Flyout';

const setAppConfig = (appConfig) => {
    if (window.parent) {
        window.parent.postMessage({
            message: appConfig,
            type: `setAppConfig_for_${appConfig.name}`
        }, "*")
    }
}

let fieldInfo = {};

const initializeField = ({ containerRef, onReady }) => {
    
    const fieldID = getUrlParameter('fieldID');
    const fieldName = getUrlParameter('fieldName');
    const location = getUrlParameter('location');

    var messageID = getMessageID({location, fieldName, fieldID});

    autoSyncFieldHeight({ containerRef, messageID });

    //get the field ready to wait for messages from the parent
    console.log(`${messageID} => Waiting for message from Agility CMS`)

    //open a channel to listen to messages from the CMS
    window.addEventListener("message", function (e) {
     
        //only care about these messages
        if(e.data.type === `setInitialProps_for_${messageID}`) {
            console.log(`${messageID} => auth, fieldValue received from Agility CMS, setting up field...`)

            //set field info that we can re-use later
            fieldInfo = e.data.message;
            fieldInfo.location = location;

            onReady(fieldInfo);

        } else {
            //show us the unhandled message...
            console.log(`${messageID} => IGNORING MESSAGE FROM PARENT: `, e.data)
        }
    }, false);

    //let the CMS know we are NOW ready to receive messages
    if (window.parent) {
        console.log(`${messageID} => 😀 Notifying Agility CMS this field is ready to receive messages...`)
        window.parent.postMessage({
            message: "ready",
            type: `ready_for_${messageID}`
        }, "*")
    } else {
        console.log(`${messageID} => 😞 Parent window not found. You must load this within Agility CMS as an iFrame.`)
    }

}

const getMessageID = ({ location, fieldName, fieldID }) => {
    return location + '_' + fieldName + '_' + fieldID;
}

const updateFieldValue = ({ value }) => {
    var messageID = getMessageID({
        location: fieldInfo.location,
        fieldName: fieldInfo.fieldName,
        fieldID: fieldInfo.fieldID
    });

    if (window.parent) {
        window.parent.postMessage({
            message: value,
            type: `setNewValue_for_${messageID}`
        }, "*")
      } else {
        console.log(`${messageID} => 😞 Can't post message to parent.`)
      }
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

const openFlyout = ({title, size, name, onClose, params }) => {
    const messageID = getMessageID({
        location:APP_LOCATION_CUSTOM_FIELD,
        fieldID: fieldInfo.fieldID,
        fieldName: fieldInfo.fieldName
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

const closeFlyout = ({ params }) => {

    const location = APP_LOCATION_CUSTOM_FIELD;
    const messageID = getMessageID({ location, fieldID: fieldInfo.fieldID, fieldName: fieldInfo.fieldName})
    if (window.parent) {
        window.parent.postMessage({
            message: {
                location,
                fieldName: fieldInfo.fieldName,
                fieldID: fieldInfo.fieldID,
                params
            },
            type: `closeFlyout_for_${messageID}`
        }, "*")
    }
}

const getAppLocation = () => {
    const location = getUrlParameter('location');
    if(location === APP_LOCATION_CUSTOM_FIELD) {
        const fieldTypeName = getUrlParameter('fieldTypeName');
        return {
            location,
            name: fieldTypeName
        }
    } else if(location === APP_LOCATION_APP_CONFIG) {
        return {
            location
        }
    } else if(location === APP_LOCATION_FLYOUT) {
        const flyoutName = getUrlParameter('flyoutName');
        return {
            location,
            name: flyoutName
        }
    } else {
        return {
            location: APP_LOCATION_UNKNOWN,
            name: null
        };
    }
}

const resolveAppComponent = (appConfig) => {
    
    const appLocation = getAppLocation();
    const currentAppComponent = appConfig.appComponents.find((appComponent) => {
        return appComponent.location === appLocation.location && (!appLocation.name || appComponent.name === appLocation.name);
    });

    if(currentAppComponent) {
        return currentAppComponent.componentToRender;
    } else {
        console.error("Could not render the '" + appConfig.name + "' component for '" + appLocation.location + "' with the name of '" + appLocation.name + "'");
    }
}

const getUrlParameter = (name) => {
    //eslint-disable-next-line
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const subscribeToFieldValueChanges = ({ fieldName, onChange}) => {
    const messageID = getMessageID({ fieldID: fieldInfo.fieldID, fieldName: fieldInfo.fieldName, location: fieldInfo.location })
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
    setAppConfig,
    initializeField,
    updateFieldValue,
    updateFieldHeight,
    subscribeToFieldValueChanges,
    getAppLocation,
    resolveAppComponent,
    openFlyout,
    closeFlyout,
    APP_LOCATION_CUSTOM_FIELD,
    APP_LOCATION_UNKNOWN,
    APP_LOCATION_APP_CONFIG,
    APP_LOCATION_FLYOUT
}