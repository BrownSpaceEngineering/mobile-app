'use strict'
import React, {Component} from 'react';
import {View, StyleSheet, Status, StatusBar, Platform} from 'react-native';

const IOS_STATUS_BAR_HEIGHT = 20;
const ANDROID_STATUS_BAR_HEIGHT = StatusBar.currentHeight;

global.STATUS_BAR_HEIGHT = (Platform.OS === 'ios') ? IOS_STATUS_BAR_HEIGHT : ANDROID_STATUS_BAR_HEIGHT;

class StatusBarBackground extends Component {
  render() {
    return(
      <View>
        <StatusBar          
          barStyle="light-content"
        />
        <View style={[styles.statusBarBackground, this.props.style || {}]} />        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: "#19222a",
  }

})

module.exports= StatusBarBackground