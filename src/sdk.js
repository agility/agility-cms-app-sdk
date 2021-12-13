import * as fieldMethods from './fields'
import * as flyoutMethods from './flyouts'
import types from './types'
import 'regenerator-runtime/runtime.js'
import { getUrlParameter, getMessageID, autoSyncFieldHeight } from './utils'
import { notifyCMS, listenForCMS } from './messages'
import { version as sdkVersion} from '../package.json'

const setAppConfig = (appConfig) => {
    //pass the sdk version to the CMS when setting the app config
    appConfig.__sdkVersion = sdkVersion;
    const appDefinitionID = getUrlParameter('appDefinitionID');
    notifyCMS({ message: appConfig, messageChannel: `setAppConfig_for_${appDefinitionID}`})
}


const initializeField = async ({ containerRef }) => {
    const fieldSDK = await initializeAppComponent({ containerRef, location: types.APP_LOCATION_CUSTOM_FIELD })
    return fieldSDK;
}

const initializeFlyout = async ({ containerRef }) => {
    const flyoutSDK = await initializeAppComponent({ containerRef, location: types.APP_LOCATION_FLYOUT })
    return flyoutSDK;
}

const initializeAppComponent = async ({ containerRef, location}) => {
    // returns different available methods depending on whether this is a CustomField or a Flyout
    return new Promise(resolve => {
        
        const initiator = {
            name: getUrlParameter('initiatorName'),
            id: getUrlParameter('initiatorID').length > 0 ? getUrlParameter('initiatorID') : null
        };

        let id = null;
        if(location === types.APP_LOCATION_CUSTOM_FIELD) {
            id = getUrlParameter('fieldID');
        } else if(location === types.APP_LOCATION_FLYOUT) {
            id = getUrlParameter('flyoutName'); 
        }

        var messageID = getMessageID({location, id, initiator});

        autoSyncFieldHeight({ containerRef, messageID });

        //get the field ready to wait for messages from the parent
        //console.log(`${messageID} => Waiting for message from Agility CMS`)

        listenForCMS({ messageChannel: `setInitialProps_for_${messageID}` }).then((props) => {
            props.location = location;
            let availableMethods = {};

            if(location === types.APP_LOCATION_CUSTOM_FIELD) {
                availableMethods = fieldMethods;
            } else if(location === types.APP_LOCATION_FLYOUT) {
                availableMethods = flyoutMethods
            } 

            //return our SDK for the appropriate UI component
            resolve({
                ...props,
                ...availableMethods
            })
        })

        notifyCMS({ message: "ready", messageChannel: `ready_for_${messageID}`})

    })
}



const resolveAppComponent = (appConfig) => {
    
    const appLocation = getAppLocation();
    const currentAppComponent = appConfig.appComponents.find((appComponent) => {
        return appComponent.location === appLocation.location && (!appLocation.name || appComponent.name === appLocation.name);
    });

    if(currentAppComponent) {
        return currentAppComponent.componentToRender;
    } else if(appLocation.location === types.APP_LOCATION_APP_CONFIG) {
        return types.APP_LOCATION_APP_CONFIG;
    } else {
        console.error("Could not render the '" + appConfig.name + "' component for '" + appLocation.location + "' with the name of '" + appLocation.name + "'");
    }
}

const getAppLocation = () => {
    const location = getUrlParameter('location');
    if(location === types.APP_LOCATION_CUSTOM_FIELD) {
        const fieldTypeName = getUrlParameter('fieldTypeName');
        return {
            location,
            name: fieldTypeName
        }
    } else if(location === types.APP_LOCATION_APP_CONFIG) {
        return {
            location
        }
    } else if(location === types.APP_LOCATION_FLYOUT) {
        const flyoutName = getUrlParameter('flyoutName');
        return {
            location,
            name: flyoutName
        }
    } else {
        return {
            location: types.APP_LOCATION_UNKNOWN,
            name: null
        };
    }
}


export  {
    setAppConfig,
    initializeField,
    initializeFlyout,
    resolveAppComponent,
    types,
    sdkVersion
}