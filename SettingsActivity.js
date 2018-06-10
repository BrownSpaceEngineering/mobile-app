import { ThemeProvider, Toolbar } from 'react-native-material-ui';
import StatusBarBackground from './StatusBarBackground';
import React, {Component} from 'react';
import { Alert, StyleSheet, Text, Button, Modal, View, Image, ScrollView, Share, WebView } from 'react-native';

export default class SettingsActivity extends React.Component
{
  static navigationOptions =
  {
     header: null,
  };

  render()
  {
    const {goBack} = this.props.navigation;
      return(
         <ThemeProvider uiTheme={uiTheme}>
           <View>
             <StatusBarBackground/>
             <Toolbar 
               centerElement="Settings"
               leftElement="arrow-back"
               onLeftElementPress={(e) => {
                 goBack()
               }}
               />
           </View>
         </ThemeProvider>
      );
  }
}