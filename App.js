import React from 'react';
import { Alert, StyleSheet, Text, View, Image, ScrollView, Share, WebView } from 'react-native';
import axios from 'axios'
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR, BottomNavigation, Dialog, DialogDefaultActions, ThemeProvider, Toolbar } from 'react-native-material-ui';
import { createStackNavigator } from 'react-navigation';

import StatusBarBackground from './StatusBarBackground';
import SettingsActivity from './SettingsActivity';
import TrackFragment from './TrackFragment';
import DataFragment from './DataFragment';
import CADFragment from './CADFragment';

// you can set your style right here, it'll be propagated to application
global.uiTheme = {
    palette: {
        primaryColor: "#FFFFFF",
        accentColor: "#5284CE",
        primaryTextColor: "#FFFFFF",
        secondaryTextColor: "#788ca1",
        alternateTextColor: "#FFFFFF"
    },
    toolbar: {
      container: {
        height: 60,
        backgroundColor: "#19222a",
      },
    },
};


global.styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },  
});

class MainActivity extends React.Component {
  state = {
      modalVisible: false,
      activeTab: 'data',
  }

  static navigationOptions =
  {
     header: null,
  };

  OpenSettingsFunction = () =>
  {
     this.props.navigation.navigate('SettingsActivity');
  }

  ShareMessage=()=>
    {
      Share.share(
      {      
        message: "I'm tracking EQUiSat, Brown University's first-ever satellite, using the EQUiSat App! equisat.brownspace.org",        
      });
    }

  openModal() {
    this.setState({modalVisible: true});
  }

  closeModal() {
    this.setState({modalVisible: false});
  }

  componentDidMount() {
    var _this = this;
    /* TODO:
    Fix the API call*/
    /*this.serverRequest =
      axios
        .get('http://0.0.0.0/api/get_lonlatalt')
        .then(function(result) {
          _this.setState({
            latitude: result.latitude,
            longitude: result.longitude,
            altitude: result.altitude});
        })
        .catch(function (error) {
          alert(error);
          return undefined; });
    function success(pos) {
        _this.setState({
          userLatitude: pos.coords.latitude,
          userLongitude: pos.coords.longitude});
      };
    navigator.geolocation.getCurrentPosition(success);*/
  }

  displayActiveTabView(activeTab) {    
    switch(activeTab) {
      case "cad":
        return <CADFragment/>;
        break;
      case "track":
        return <TrackFragment/>;
        break;
      case "data":
        //return this.dataTabView();
        return <DataFragment/>;
        break;
    }
  }

  showAboutDialog() {
    Alert.alert(
      'About',
      "Created by Brown Space Engineering, a team of undergraduates at Brown University. \
      \n\nTrack EQUiSat on the Web: equisat.brownspace.org \
      \nLearn more about our 1U Cubesat, EQUiSat: https://brownspace.org/EQUiSat \
      \nLearn more about the club and see what other projects we are working on: https://brownspace.org \
      \nHelp support our student-run club: https://brownspace.org/donate \
      ",
      [        
        {text: 'close'},
      ],      
    )
  }

  render() {
    return (      
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{ flex: 1 }}>
          <StatusBarBackground/>
          <Toolbar 
            centerElement="EQUiSat" 
            rightElement={{
              actions: ['share', ],
              menu: { labels: ['Settings', 'About'] }
            }}
            onRightElementPress={(e) => {
              switch(e.action) {
                case "share":
                  {this.ShareMessage()}
                  break;
                case "menu":
                  switch(e.index) {
                    case 0:
                      //settings
                      {this.OpenSettingsFunction()}
                      break;
                    case 1:
                      //about
                      this.showAboutDialog()
                      break;
                  }                
              }              
            }}          
          />            
          <View style={{ flex: 1 }}>
            {/* Your screen contents depending on current tab. */            
              this.displayActiveTabView(this.state.activeTab)            
            }          
          </View>
          <BottomNavigation active={this.state.activeTab} hidden={false} style={{container:{backgroundColor: "#19222a"}}}>
          <BottomNavigation.Action
              key="cad"
              icon="3d-rotation"
              label="CAD"              
              onPress={() => this.setState({ activeTab: 'cad' })}              
          />
          <BottomNavigation.Action
              key="track"
              icon="my-location"
              label="Track"
              onPress={() => this.setState({ activeTab: 'track' })}              
          />
          <BottomNavigation.Action
              key="data"
              icon="show-chart"
              label="Data"
              onPress={() => this.setState({ activeTab: 'data' })}              
          />        
      </BottomNavigation>
        </View>
      </ThemeProvider>
    );
  }
}

export default ActivityProject = createStackNavigator(
{
  Main: { screen: MainActivity },
  
  SettingsActivity: { screen: SettingsActivity }
});