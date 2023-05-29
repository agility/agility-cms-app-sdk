# Agility CMS App SDK
This is a React SDK for building UI Apps for Agility CMS.

## Getting Started
Coming soon...

## Example Apps
One of the best ways to learn a new SDK is to see some examples!

### Google Analytics
A dashboard app that uses oauth to connect to Google and pull GA data.
https://github.com/agility/agility-cms-app-google-analytics

### Google Translate
A sidebar app that translates and detects language for the current content item.
https://github.com/agility/agility-cms-app-google-translate

### Big Commerce
A custom field app that allows selection of a product from BigCommerce.  Includes a modal with a product listing and search component.
https://github.com/agility/agility-cms-app-bigcommerce








### Local Development


## Advanced
If you wish to use yarn link with this project to debug locally:

```
cd THIS_PACKAGE
yarn link
yarn install
cd node_modules/react
yarn link

cd YOUR_PROJECT
yarn link PACKAGE_YOU_DEBUG_LOCALLY
yarn link react
```

Then, when you are done

```
cd YOUR_PROJECT
yarn unlink "@agility/app-sdk"
yarn unlink react


cd THIS_PACKAGE
yarn unlink
cd node_modules/react
yarn unlink


```