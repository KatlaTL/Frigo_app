
# Webudvikling bachelor project - Frigo
This project is the app frontend part of the bachelor project developed by Asger Thorsboe Lundblad in collaboration with the firm Pentia.
Frigo is an app developed to internal use and its purpose is to purchase small products from the fridge at Pentias workplace.
The app doesn't do any direct transactions, instead it stores the purchases in the database so Pentia at a later time can subtract the amount from their workers payslips.

This repository only contains the app part. It is necessary to fetch and run the backend for the app to work. The backend can be found in this [repository](https://github.com/KatlaTL/Frigo_backend)

## Table of Contents

<ol>
    <li>
        <a href="#tech-stack">Tech Stack</a>
    </li>
    <li>
        <a href="#run-the-project">Run the project</a>
        <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
            <li><a href="#deployment">Deployment</a></li>
        </ul>
    </li>
    <li><a href="#project-structure">Project Structure</a></li>
</ol>
<br />


## Tech Stack
The app are developed in React Native (without Expo) and Typescript. \
The backend is developed in NextJS using Prisma ORM to connect to a MySQL database [The projects backend](https://github.com/KatlaTL/Frigo_backend)

## Run the project
Follow these steps to run app

### Prerequisites
Before running the app make sure you have following setup and installed:
- Setup a [React Native](https://reactnative.dev/docs/0.74/set-up-your-environment) environments for Android and IOS

### Deployment
1. Clone the repository
    ```
    git clone https://github.com/KatlaTL/Frigo_app.git
    ```
2. Change the working directory to the project:
    ```
    cd Frigo_app
    ```
3. Install dependencies:
    * NPM:
    ```
    npm install
    ```
    * Yarn:
    ```
    yarn install
    ```
4.  Install all the Pods for IOS:
    ```
    cd ios && pod install --repo-update && cd ..
    ```
5. Run the application:
    - Start the metro bundler
        * NPM
        ```
        npm run start
        ```
        * Yarn
        ```
        yarn run start
        ````
    - Run the app on Android and pick one of the emulators you set up earlier
        * NPM
        ```
        npm run android
        ```
        * Yarn
        ```
        yarn run android
        ````
    - Run the app on IOS and pick one of the simulators you set up earlier
        * NPM
        ```
        npm run ios
        ```
        * Yarn
        ```
        yarn run ios
        ````

<p align="right">(<a href="#Webudvikling-bachelor-project---Frigo">back to top</a>)</p>

## Project Structure
The project structure for the Frigo app is organized as following:
```
app
├── App.tsx
├── assets
│   ├── fonts
│   │   ├── SpaceGrotesk-Bold.ttf
│   │   ├── SpaceGrotesk-Light.ttf
│   │   ├── SpaceGrotesk-Medium.ttf
│   │   ├── SpaceGrotesk-Regular.ttf
│   │   └── SpaceGrotesk-SemiBold.ttf
│   ├── img
│   │   ├── icons
│   │   │   ├── bottom-add.png
│   │   │   ├── bottom-add@2x.png
│   │   │   ├── bottom-add@3x.png
│   │   │   ├── bottom-subtract.png
│   │   │   ├── bottom-subtract@2x.png
│   │   │   ├── bottom-subtract@3x.png
│   │   │   ├── favorite-icon-active.png
│   │   │   ├── favorite-icon-active@2x.png
│   │   │   ├── favorite-icon-active@3x.png
│   │   │   ├── favorite-icon-inactive.png
│   │   │   ├── favorite-icon-inactive@2x.png
│   │   │   ├── favorite-icon-inactive@3x.png
│   │   │   ├── history-receipt.png
│   │   │   ├── history-receipt@2x.png
│   │   │   ├── history-receipt@3x.png
│   │   │   └── no-image.png
│   │   ├── logo
│   │   │   ├── logo.png
│   │   │   └── logo.svg
│   │   └── tabbar
│   │       ├── favorite.svg
│   │       ├── frigde.svg
│   │       ├── heart.svg
│   │       ├── history.svg
│   │       ├── home.svg
│   │       ├── newspaper.svg
│   │       ├── settings.svg
│   │       └── soda.svg
│   └── styles
│       ├── colors.ts
│       ├── index.ts
│       └── shared.styles.ts
├── components
│   ├── button.tsx
│   ├── custom-bottom-sheet.tsx
│   ├── gradient.tsx
│   ├── loading.tsx
│   ├── logo.tsx
│   ├── product-bottom-sheet.tsx
│   ├── slider-button.tsx
│   ├── top-bar-container.tsx
│   └── top-bar-title.tsx
├── constants.ts
├── contexts
│   ├── auth.context.tsx
│   ├── axios.context.tsx
│   ├── loading.context.tsx
│   └── product.context.tsx
├── hooks
│   ├── use-auth.ts
│   ├── use-favorite.ts
│   ├── use-products.ts
│   ├── use-purchases.ts
│   └── use-toast.ts
├── navigators
│   ├── _components
│   │   ├── carousel-clickable-icon.tsx
│   │   ├── tabbar-icon.tsx
│   │   └── tabbar-label.tsx
│   ├── app.navigator.tsx
│   ├── auth.navigator.tsx
│   ├── carousel-top-tab.navigator.tsx
│   ├── root.navigator.tsx
│   └── types.tsx
├── screens
│   ├── history
│   │   ├── _components
│   │   │   ├── history.screen.presentation.tsx
│   │   │   ├── section-list-collapsable-animation.tsx
│   │   │   └── section-list-item.tsx
│   │   ├── history.screen.tsx
│   │   └── index.ts
│   ├── products
│   │   ├── _components
│   │   │   ├── product-item.tsx
│   │   │   └── products.screen.presentation.tsx
│   │   ├── _strategies
│   │   │   ├── favorites.strategy.ts
│   │   │   ├── index.ts
│   │   │   ├── products.strategy.ts
│   │   │   └── types.ts
│   │   ├── index.ts
│   │   └── products.screen.tsx
│   ├── settings
│   │   ├── index.ts
│   │   └── settings.screen.tsx
│   ├── signin
│   │   ├── _components
│   │   │   └── text-input.tsx
│   │   ├── index.ts
│   │   └── signin.screen.tsx
│   └── splash
│       ├── index.ts
│       └── splash.screen.tsx
├── services
│   ├── Auth.service.ts
│   ├── Product.service.ts
│   └── Purchases.service.ts
└── utils
    ├── debounce.ts
    ├── numbers.ts
    └── strings.ts
```

1. **`App.tsx` File** This is the root file of the app with all the different providers
2. **`assets` Directory** for all assets, fonts and styles
    - **`fonts`** Contains the fonts used
    - **`img`** Contains images and icons
    - **`styles`** Contains global styles
3. **`components` Directory** contains all global components used across the app
4. **`constants.tsx` File** This file contains all contant values used in the app
5. **`contexts` Directory** for contexts files
6. **`hooks` Directory** for custom hooks
7. **`navigators` Directory** for the apps navigators: Root navigator, App navigator, Auth navigator and Carousel top bar navigator
8. **`screens` Directory** for the different screens used across the app
    - **`history`** History screen
        - **`_components`** Components used in the history screen
    - **`products`** Products and favorite screen
        - **`_components`** Components used in the products and favorite screen
        - **`_strategies`** Strategies to use if it's the  products or favorite screen
    - **`settings`** Settings in screen
    - **`signin`** Sign in screen
        - **`_components`** Components used in the sign in screen
    - **`splash`** Splash screen
9. **`services`Directory** for all services files, used to do HTTP request to the backends API
10. **`utils` Directory** for all files containing utility functions

<p align="right">(<a href="#Webudvikling-bachelor-project---Frigo">back to top</a>)</p>
