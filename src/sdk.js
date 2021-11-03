import * as fieldMethods from './fields'
import locations from './locations'
import 'regenerator-runtime/runtime.js'
import { getUrlParameter, getMessageID, autoSyncFieldHeight } from './utils'

const initializeAppConfig = (appConfig) => {
    if (window.parent) {
        window.parent.postMessage({
            message: appConfig,
            type: `setAppConfig_for_${appConfig.name}`
        }, "*")
    }
}


const initializeField = async ({ containerRef }) => {
    
    return new Promise(resolve => {
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
                const fieldInfo = e.data.message;
                fieldInfo.location = location;

                resolve(new function() {
                    return {
                        ...fieldInfo,
                        ...fieldMethods
                    }
                }());

            
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
    })

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

const getAppLocation = () => {
    const location = getUrlParameter('location');
    if(location === locations.APP_LOCATION_CUSTOM_FIELD) {
        const fieldTypeName = getUrlParameter('fieldTypeName');
        return {
            location,
            name: fieldTypeName
        }
    } else if(location === locations.APP_LOCATION_APP_CONFIG) {
        return {
            location
        }
    } else if(location === locations.APP_LOCATION_FLYOUT) {
        const flyoutName = getUrlParameter('flyoutName');
        return {
            location,
            name: flyoutName
        }
    } else {
        return {
            location: locations.APP_LOCATION_UNKNOWN,
            name: null
        };
    }
}


export  {
    initializeAppConfig,
    initializeField,
    resolveAppComponent,
    locations
}