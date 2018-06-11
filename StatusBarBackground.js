'use strict'
import React, {Component} from 'react';
import {View, StyleSheet, Status, StatusBar, Platform} from 'react-native';

class StatusBarBackground extends Component {
  render() {
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