# Frontend at the high level

Frontend part of project is beong builded in react-native and expo framework.

## Tech stack

- React Native
- Expo
- Typescript

## Frontend file structure

```
.
├── api —> requests to backend
├── app —> file-based routing
│   ├── (auth)
│   └── (tabs)
├── assets
│   ├── fonts
│   ├── icons
│   └── images
├── components —> unshared components
├── context
├── features —> feautre-based structure
│   ├── aboutUser
│   │   ├── components
│   │   │   └── changeNicknameModal
│   │   │       └── hooks
│   │   └── hooks
│   ├── dashboard
│   │   ├── components
│   │   ├── hooks
│   │   └── modals
│   │       ├── components
│   │       │   ├── ActivityTypePicker
│   │       │   ├── ModalTimePicker
│   │       │   └── SubjectiveCoefSelector
│   │       ├── CreateEventModal
│   │       └── utils
│   ├── events_list
│   │   └── hooks
│   ├── register
│   │   ├── components
│   │   │   ├── credentials_step
│   │   │   ├── current_state_step
│   │   │   └── loads_order_step
│   │   └── hooks
│   └── statistics
│       ├── hooks
│       └── utils
├── shared —> shared components and types
│   ├── components
│   └── utils
├── theme —> colorscheme
└── utils
```

## Getting Started

### Pre-requirements

- Node.js >= 20
- npm or yarn
- Expo CLI
- Android studio

## Running app locally

1. ### Clone the repository

    ```
    git clone https://github.com/IceBear8965/Revos.git
    cd Revos
    ```

2. ### Install dependencies

    ```
    npm install
    # or
    yarn install
    ```

3. ### Set up android studio

    ```
    Instructions can be found here:
    https://docs.expo.dev/workflow/android-studio-emulator/
    ```

4. Prebuild app

    ```
    npx expo prebuild
    ```

5. Run app
    ```
    npx expo run:android
    ```

## Product build

Instructions to product build can be found here:
https://docs.expo.dev/guides/local-app-production/

.keystore file should be stored in ./android/key-store-name.keystore
