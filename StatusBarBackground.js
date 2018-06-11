'use strict'
import React, {Component} from 'react';
import {View, Text, StyleSheet, Status, StatusBar, Platform} from 'react-native';

const IOS_STATUS_BAR_HEIGHT = 20;
const ANDROID_STATUS_BAR_HEIGHT = 25;

class StatusBarBackground extends Component{
  render(){
    return(
      <View style={[styles.statusBarBackground, this.props.style || {}]}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: StatusBar.currentHeight,
    backgroundColor: "#19222a",
  }

})

module.exports= StatusBarBackground