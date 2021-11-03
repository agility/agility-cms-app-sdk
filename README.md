# Agility CMS App SDK
This is a JavaScript SDk for building UI Apps for Agility CMS. 

## Features
- Build custom UIs that can be shown in Agility CMS
- Secure iFrame communication between the CMS and your app.
- Ability to define one or more custom fields and flyout actions.
- Supports modern frameworks such as React or Vue, as well as support for building Vanilla javascript apps.
- Support for additional UI components (aside from Custom Fields) is coming soon!

## How it Works
The **App SDK ** facilitates a communication layer between Agility CMS and a single-page app that will be loaded in an iFrame. Using the SDK allows you to easily integrate with the CMS using JavaScript. 

At this time, only Custom Fields are supported, however there are plans to introduce new UI locations such as Sidebar apps.

### What you can Do
Just rendering your UI in a content input form isn't enough. The **App SDK  ** allows you to:
- Set a custom field value
- Set the value of another field
- Run custom logic when another field changes
- Launch a flyout with a custom UI
- Retrieve `configValues` that were set when the app was installed (such as API Keys, etc.)

## Getting Started

### Prerequisites
You need to have an Agility instance and be comfortable writing JavaScript. You'll also need to deploy your app to a publicly accessible endpoint and register it in Agiltiy CMS.

### What is in an App?
An App will contain a page with an `AppConfig` and one or more custom UI's that will integrate with Agility CMS.

- **AppIndex** - This is your HTML page that will contain logic to show your UI component based on what App Location the CMS is requesting (i.e. `AppConfig`, `CustomField`, or `Flyout`)
- **AppConfig** - The component responsible registering the App in the CMS and establishing what user-definied `configValues` can be set.
- **CustomField(s)** - The UI components responsible for rendering a custom field for a Content Model or Page Module.
- **Flyout(s)** - The UI components responsible for rendering the details of a flyout that was opened from a Custom Field.


### Installation
Install it using a package manager (recommended):
`npm install @agility/app-sdk` or `yarn add @agility/app-sdk`.

If you are building in Vanilla javascript, you can also reference a standalong package that can be used in a browser using a traditional `<script>` tag. In this case, the sdk can be accessed using a global variable by the name of `agilityAppSDK`.

```html
<!-- Use a specific version (i.e. 0.0.6) -->
<script type="text/javascript" src="https://unpkg.com/@agility/app-sdk@0.0.6/dist/agility-cms-app-sdk.browser.js"></script>
```

## Set up your App Index
When your App is installed in an Agility instance, Agility will automatically call your App by the URL it is hosted on. 

Your root page for your App must contain logic to determine what UI component is being requested by the CMS. Then, it should render the component/logic appropriately.

An example of this in React `App.js`:
```javascript
import agilityAppSDK from '@agility/app-sdk'

//the UI components that make up your App
import BasicCustomField from './BasicCustomField';
import AppConfig from './AppConfig'
import Flyout from './Flyout';

const Components = {
    BasicCustomField,
    AppConfig,
    Flyout
  }

function App() {

  //your app configuration
  const appConfig = {
    name: 'Basic App',
    version: '1.0.0',
    params: [
        { name: 'apiKey', label: 'API Key', type: 'string'}
    ],
    appComponents: [
      {
        location: agilityAppSDK.locations.APP_LOCATION_APP_CONFIG,
        name: 'AppConfig',
        componentToRender: 'AppConfig'
      },
      {
        location: agilityAppSDK.locations.APP_LOCATION_CUSTOM_FIELD,
        label: 'Basic Custom Field',
        name: 'BasicCustomField',
        componentToRender: 'BasicCustomField'
      },

      {
        location: agilityAppSDK.locations.APP_LOCATION_FLYOUT,
        componentToRender: 'Flyout',
        name: 'Flyout1'
      }
    ]
  };

  //using the `resolveAppComponent` method to return the `componentToRender` property of the component that is requested by the CMS
  const ComponentToRender = Components[agilityAppSDK.resolveAppComponent(appConfig)];
  
  if(ComponentToRender) {
      //render the desired component (i.e. AppConfig, BasicCustomField, or Flyout)
    return <ComponentToRender appConfig={appConfig} />;
  } else {
    return <h2>Warning: App must be loaded within Agility CMS.</h2>
  }

}

export default App;
```

## Set up your App Configuration
When the App is initially installed or whenever Agility CMS loads, it needs to be able to access your `AppConfig`.

Your `AppConfig` must be in a specific format, and you must initialize it appropriately using the `initializeAppConfig` method from the SDK.

```javascript
const appConfig = 
{
    name: 'Basic App',
    version: '1.0.0',
    params: [
        { name: 'apiKey', label: 'API Key', type: 'string'}
    ],
    appComponents: [
        {
            location: agilityAppSDK.locations.APP_LOCATION_APP_CONFIG,
            name: 'AppConfig',
            componentToRender: 'AppConfig'
        },
        {
            location: agilityAppSDK.locations.APP_LOCATION_CUSTOM_FIELD,
            name: 'BasicCustomField',
            componentToRender: 'BasicCustomField',
            label: 'Basic Custom Field',
        },

        {
            location: agilityAppSDK.locations.APP_LOCATION_FLYOUT,
            name: 'Flyout1',
            componentToRender: 'Flyout',
        }
    ]
};
```
### App Configuration Parameters
**`*`** Represents a required configuration parameter.

`name: <string> *`

The name of your App (will be displayed in Agiliity CMS).

`version: <string> *`

The version of your App (can be any string, will be displayed in Agility CMS).

`params: <objectArray>`

The (optional) parameters you want to capture when a user installs the App.

`params[].name <string> *`

The reference name of the parameter you want to capture.

`params[].label <string> *`

The friendly label of the parameter you want to capture.

`params[].type <string> *`

The type of input that is expected. Valid values are `string` only at this time.

`appComponents <objectArray> *`

The array of components that your App supports. It *must* include a component with the *location* of `"AppConfig"`.

`appComponents[].location <string> *` => The location type of the custom field. Valid values are:
- `agilityAppSDK.locations.APP_LOCATION_APP_CONFIG`
- `agilityAppSDK.locations.APP_LOCATION_CUSTOM_FIELD`
- `agilityAppSDK.locations.APP_LOCATION_FLYOUT`

`appComponents[].name <string> *`

The reference name of the component. For Custom Fields, this is used to store the name of the custom field type in your Models. For Flyouts, this represents a unique name for opening flyouts (if you have many).

`appComponents[].componentToRender <string> *`

The name of your component that will be used to determine which UI component to render. This is returned from `agilityAppSDK.resolveAppComponent(appConfig)`.

`appComponents[].label <string> * (Required for **Custom Fields** only)` 

This is the friendly label of the custom field which is used in Models to display a list of all available custom fields.

***

### Using the App Configuration

Once you have established your App Configuration, you need to tell Agility CMS about it within your `AppConfig` component when requested.

`agilityAppSDK.initializeAppConfig(<appConfig>): void`

Sends a message to the CMS to inform it of our App.


An example of this in React `AppConfig.js`
```javascript
import { useEffect, useRef } from 'react';
import agilityAppSDK from '@agility/app-sdk'

function AppConfig({ appConfig }) {

    const containerRef = useRef();
    useEffect(() => {
        agilityAppSDK.initializeAppConfig(appConfig);
    }, [appConfig]);

    //no need to render anything when initializing the AppConfig
    return (
        <div className="AppConfig" ref={containerRef}></div>
    );
}

export default AppConfig;
```
**Note**: If your App does not notify the CMS about its configuration within *3 seconds* of being requested, we'll treat the App as non-responsive and prevent it from being used in the CMS.


## Set Up your Custom Field
Now that you have your **App Index** and **App Config** set up, the next step is to set up your custom field component(s).


An example of this in React `BasicCustomField.js`:
```javascript
import { useEffect, useState, useRef } from 'react';
import agilityAppSDK from '@agility/app-sdk'

function BasicCustomField() {

  const [value, setValue] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [configValues, setConfigValues] = useState({});
  const [sdk, setSDK] = useState({})
  const containerRef = useRef();

  useEffect(() => {
    const init = async () => {
      const fieldSDK = await agilityAppSDK.initializeField({ containerRef });
      setSDK(fieldSDK);
      
      //set the actual value of the field
      setValue(fieldSDK.fieldValue);
      setFieldLabel(fieldSDK.fieldLabel);
      setConfigValues(fieldSDK.configValues);

      fieldSDK.subscribeToFieldValueChanges({
        fieldName: 'Title',
        onChange: ({fieldName, fieldValue}) => {
          console.log(fieldName, fieldValue)
        }
      })
    }
    init();
  }, []);

  const updateValue = (newVal) => {
    //update the react state
    setValue(newVal);
    //notify Agility CMS of the new value
    sdk.updateFieldValue({ fieldValue: newVal });
  }

  const openCustomFlyout = () => {
    
    sdk.openFlyout({
      title: 'Flyout Title',
      size: null,
      name: 'Flyout1',
      onClose: (params) => {
        //passes the parameters back from the app component that closed the flyout
        console.log(params);
      },
      params: {
        key: 'value'
      }
    })
  }

  return (
    <div className="BasicCustomField" ref={containerRef}>
      <label>
        {fieldLabel}
        <input style={{display: 'block', width: '100%'}} type="text" value={value} onChange={e => updateValue(e.target.value)} />
      </label>
      <p>API Key: {configValues.apiKey}</p>
      <button onClick={openCustomFlyout}>Open Flyout</button>
    </div>
  );
}

export default BasicCustomField;
```

The above example shows how you *initialize the field*, can *subscribe to other field changes*, *set the field value*, as well as *open a flyout*.

### Using the Field SDK
In order to interact with your content, you need to call:

```
agilityAppSDK.initializeField({
    containerRef: <HtmlElem>
}): Promise<fieldSDK>
```

This will return a `Promise` which will be resolved with the `fieldSDK` client that can be used to interact with the field.

***
```
fieldSDK <object>
```

The object returned from `agilityAppSDK.initializeField` and the base SDK to use for interacting with custom fields and the content it is loaded on.
***
```
fieldSDK.updateFieldValue({
    fieldValue: <string|number|decimal>,
    fieldName: <string>
}): void
```

Sets a field value on the content item. If no `fieldName` is set, it will set the value for the current custom field being rendered.
***
```
fieldSDK.subscribeToFieldValueChanges({
    fieldName: <string>,
    onChange: <function>
}): void
```

Notifies when the value of a specific field **changes** on the content item. If a change occurs, the `onChange` function is called and passes the `fieldName <string>` and `fieldValue <string|number|decimal>` as parameters.
***
```
fieldSDK.openFlyout({ 
    title: <string>,
    size: <string>,
    name: <string>,
    onClose: <function>,
    params: <object> 
}): void
```
Notifies the CMS to open a **Flyout** in the CMS and use a **Flyout** component from your App. 

**Open Flyout Parameters**:

`title <string>`

The friendly title of the Flyout. It will be shown as the title of the Flyout in the CMS.

`size <string>` 

The size of the Flyout to open. Valid values are:
- `agilityAppSDK.flyouts.APP_FLYOUT_SIZE_SMALL`
- `agilityAppSDK.flyouts.APP_FLYOUT_SIZE_LARGE`

`name <string>`

The unique name of your Flyout. This *must* correspond to a known Flyout component with a matching `name` in your `AppConfig`.

`onClose <function>`

The function callback for when the Flyout is programatically closed from within the target Flyout component. This is useful for scenarios where you need to get some input from a user interaction that occurred in the flyout back to the custom field that called it. 

When the Flyout calls `closeFlyout`, any user defined `params` that were passed as an argument will be sent through as `params` in this `onClose` callback.

***




