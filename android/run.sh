#!/bin/bash

./gradlew ${1:-installDevDebug} --stacktrace && adb shell am start -n org.brownspace.equisat/host.exp.exponent.MainActivity
