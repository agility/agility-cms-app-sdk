# Agility CMS App SDK

This is a React SDK for building UI Apps for Agility CMS.

## Local Development

If you want to develop this SDK locally and test it in another project, follow these steps:

### Step 1: Clone and Install Dependencies

First, clone the repository and install dependencies.

```bash
git clone https://github.com/agility/agility-cms-app-sdk.git
cd agility-cms-app-sdk
yarn install
```

### Step 2: Build the SDK

Before using the SDK in your local project, build the package using the following command:

```bash
yarn build
```

This will clean, compile, and bundle the SDK, placing the output in the `dist` folder.

### Step 3: Link the SDK for Local Development

To use the SDK in your local project, you can use yarn link. This allows your local project to reference the SDK directly without needing to publish it to npm.

```bash
cd agility-cms-app-sdk
yarn link
```

### Step 4: Using the SDK in Your Project

Once the SDK is linked, you can link it to your project:

```bash
cd your-project
yarn link "@agility/app-sdk"
```

At this point, your project will use the local version of the SDK.

### Step 5: Watching for Changes

If you're actively developing the SDK, you can start the watch mode for continuous builds:

```bash
cd agility-cms-app-sdk
yarn watch
```

This will watch for changes and rebuild the SDK as needed.

## Avoiding React Linking:

To avoid conflicts between React versions, React is treated as a peer dependency and is not bundled with the SDK. This ensures that your project provides the React version, and you don't need to manually link React.

### When You Need to Care About React Versions

- Peer Dependencies: The SDK expects your project to provide its own version of react and react-dom that meets the version requirements specified in the SDK’s peerDependencies.
- Shared React: As long as your project provides a compatible React version, everything will work without requiring manual linking.

This setup prevents version conflicts, avoids the need for linking React manually, and ensures that your project and the SDK share the same React instance.

### Unlinking the SDK

To unlink the SDK from your project, run the following command:

In your project:

```bash
cd your-project
yarn unlink "@agility/app-sdk"
```

In the SDK:

```bash
cd agility-cms-app-sdk
yarn unlink
```

This will restore the original packages from npm in both your SDK and the project.

## Example Apps

One of the best ways to learn a new SDK is to see some examples! Check out these sample apps to help you get started:

### [Google Analytics](https://github.com/agility/agility-cms-app-google-analytics)

A dashboard app that uses OAuth to connect to Google and pull Google Analytics data.

### [Google Translate](https://github.com/agility/agility-cms-app-google-translate)

A sidebar app that translates and detects language for the current content item.

### [BigCommerce](https://github.com/agility/agility-cms-app-bigcommerce)

A custom field app that allows selection of a product from BigCommerce. It includes a modal with a product listing and search component.
