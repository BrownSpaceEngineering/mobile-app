import React from 'react';
import { Alert, StyleSheet, Text, Button, Modal, View, Image, ScrollView, Share, WebView } from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios'
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea } from "victory-native";
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR, BottomNavigation, Dialog, DialogDefaultActions, ThemeProvider, Toolbar } from 'react-native-material-ui';
import { createStackNavigator } from 'react-navigation';

import StatusBarBackground from './StatusBarBackground';
import SettingsActivity from './SettingsActivity';

// you can set your style right here, it'll be propagated to application
global.uiTheme = {
    palette: {
        primaryColor: "#5284CE",
        accentColor: "#FFFFFF",
        //primaryTextColor: "#5284CE",
        //secondaryTextColor: "#5284CE",
        //alternateTextColor: "#5284CE"
    },
    toolbar: {
        container: {
            height: 60,
        },
    },
};


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

class MainActivity extends React.Component {
  state = {
      latitude: 20,
      longitude: 20,
      altitude: 0,
      userLatitude: 10,
      userLongitude: 10,
      modalVisible: false,
      activeTab: 'track',
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

  cadTabView() {
    //return <Text>"CAD"</Text>;
    return (
      <WebView
        style={{flex:1}}
        javaScriptEnabled={true}
        source={{uri: 'https://myhub.autodesk360.com/ue2aaba84/shares/public/SH7f1edQT22b515c761e08a6bec09be6c898?mode=embed'}}
      />
    );
  }

  trackTabView() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 50,
            longitudeDelta: 50
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: this.state.userLatitude,
              longitude: this.state.userLongitude
            }}
          />
          <MapView.Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude
            }}
            onPress={() => this.openModal()}
          >
            <Image
              source={require('./assets/logo.png')}
              style={{width:40, height:40}} />
          </MapView.Marker>
        </MapView>            
      </View>
      );
  }

  dataTabView() {
    return (
      <ScrollView>
        <View style={styles.modalContainer}>
          <View style={styles.innerContainer} pointerEvents="none">
            <VictoryChart width={350} theme={VictoryTheme.material}>
              <VictoryBar data={data} x="quarter" y="earnings" />
            </VictoryChart>
            <VictoryChart width={350} theme={VictoryTheme.material}>
              <VictoryLine data={data} x="quarter" y="earnings" />
            </VictoryChart>
            <VictoryChart width={350} theme={VictoryTheme.material}>
              <VictoryScatter
                style={{ data: { fill: "#c43a31" } }}
                size={7}
                data={[
                  { x: 1, y: 2.0 },
                  { x: 2.5, y: 2.8 },
                  { x: 3.1, y: 5.5 },
                  { x: 3.9, y: 6.3 },
                  { x: 5.0, y: 7 }
                ]}
              />
            </VictoryChart>
            <VictoryChart width={350} theme={VictoryTheme.material}>
              <VictoryStack>
                <VictoryArea
                  data={[{x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 5}]}
                />
                <VictoryArea
                  data={[{x: "a", y: 1}, {x: "b", y: 4}, {x: "c", y: 5}]}
                />
                <VictoryArea
                  data={[{x: "a", y: 3}, {x: "b", y: 2}, {x: "c", y: 6}]}
                />
              </VictoryStack>
            </VictoryChart>            
          </View>
        </View>
      </ScrollView>
    );
  }

  displayActiveTabView(activeTab) {    
    switch(activeTab) {
      case "cad":
        return this.cadTabView();
        break;
      case "track":
        return this.trackTabView();
        break;
      case "data":
        return this.dataTabView();
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
          <BottomNavigation active={this.state.activeTab} hidden={false} >
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