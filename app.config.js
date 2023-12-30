function getIdSuffix() {
  const variant = process.env.APP_VARIANT;
  if (variant === 'development') {
    return ".dev"
  }
  if (variant === 'preview') {
    return ".pre"
  }
  return ""
}

function getNameSuffix() {
  const variant = process.env.APP_VARIANT;
  if (variant === 'development') {
    return " (Dev)"
  }
  if (variant === 'preview') {
    return " (Pre)"
  }
  return ""
}

function getIcon() {
  const variant = process.env.APP_VARIANT;
  if (variant === 'development') {
    return "./assets/icon.dev.png"
  }
  if (variant === 'preview') {
    return "./assets/icon.pre.png"
  }
  return "./assets/icon.png"
}

export default {
  "expo": {
    "name": `ESP32 Remote Keyboard${getNameSuffix()}`,
    "slug": "esp32-remote-keyboard-app",
    "version": "1.0.0",
    "orientation": "default",
    "icon": getIcon(),
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "requireFullScreen": true,
      "bundleIdentifier": `com.agartner.esp32remotekeyboard${getIdSuffix()}`,
      "infoPlist": {
        "NSBonjourServices": [
          "_esp32_keyboard_ws._tcp."
        ]
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": `com.agartner.esp32remotekeyboard${getIdSuffix()}`
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "2e27a46e-c3e6-465a-87e0-7f35b561fea4"
      }
    },
    "plugins": [
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
        }
      ]
    ]
  }
}
