---
date: 07/10/2025
tags:
  - CMakePresets
---

>[!WARNING]
>Généré par ChatGPT

```json
{
  "version": 3,
  "cmakeMinimumRequired": {
    "major": 3,
    "minor": 16,
    "patch": 0
  },

  "configurePresets": [
    {
      "name": "debug-qt6",
      "displayName": "🐞 Debug (Qt6, Makefile)",
      "description": "Configuration Debug avec Qt6 + Makefile",
      "generator": "Unix Makefiles",
      "binaryDir": "${sourceDir}/build/debug-qt6",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug",
        "CMAKE_PREFIX_PATH": "/opt/Qt/6.5.3/gcc_64",
        "CMAKE_EXPORT_COMPILE_COMMANDS": "YES",
        "CMAKE_AUTOUIC": "ON",
        "CMAKE_AUTOMOC": "ON",
        "CMAKE_AUTORCC": "ON"
      }
    },
    {
      "name": "release-qt6",
      "displayName": "🚀 Release (Qt6, Makefile)",
      "description": "Configuration Release avec Qt6 + Makefile",
      "generator": "Unix Makefiles",
      "binaryDir": "${sourceDir}/build/release-qt6",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "CMAKE_PREFIX_PATH": "/opt/Qt/6.5.3/gcc_64",
        "CMAKE_EXPORT_COMPILE_COMMANDS": "YES",
        "CMAKE_AUTOUIC": "ON",
        "CMAKE_AUTOMOC": "ON",
        "CMAKE_AUTORCC": "ON"
      }
    }
  ],

  "buildPresets": [
    {
      "name": "build-debug-qt6",
      "configurePreset": "debug-qt6"
    },
    {
      "name": "build-release-qt6",
      "configurePreset": "release-qt6"
    }
  ]
}

```