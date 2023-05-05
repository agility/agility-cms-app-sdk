# Agility CMS App SDK
This is a React SDK for building UI Apps for Agility CMS.

### Local Development


## Advanced
If you wish to use yarn link with this project to debug locally:

```
cd THIS_PACKAGE
yarn link
yarn install
cd node_modules/react
yarn link
cd ../../node_modules/react-dom
yarn link
cd YOUR_PROJECT
yarn link PACKAGE_YOU_DEBUG_LOCALLY
yarn link react
yarn link react-dom
```

Then, when you are done

```
cd YOUR_PROJECT
yarn unlink "@agility/app-sdk"
yarn unlink react
yarn link react-dom

cd THIS_PACKAGE
yarn unlink
cd node_modules/react
yarn unlink
cd ../../node_modules/react-dom
yarn unlink

```