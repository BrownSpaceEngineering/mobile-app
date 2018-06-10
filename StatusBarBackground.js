'use strict'
import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';

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
    height: (Platform.OS === 'ios') ? IOS_STATUS_BAR_HEIGHT : ANDROID_STATUS_BAR_HEIGHT,
    backgroundColor: "#2d5b9f",
  }

})

module.exports= StatusBarBackground