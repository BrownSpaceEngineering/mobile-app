import React from 'react';
import { Alert, StyleSheet, Text, View, Image, ScrollView, Share, WebView } from 'react-native';
import axios from 'axios'
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR, BottomNavigation, Dialog, DialogDefaultActions, ThemeProvider, Toolbar } from 'react-native-material-ui';
import { TabView, TabBar, SceneMap, type Route, type NavigationState } from 'react-native-tab-view';

import StatusBarBackground from './StatusBarBackground';
import TrackFragment from './TrackFragment';
import DataFragment from './DataFragment';
import CADFragment from './CADFragment';

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
    tabbar: {
    backgroundColor: '#263238',
    overflow: 'hidden',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  indicator: {    
    backgroundColor: '#6aa2c8',  
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
});

type State = NavigationState<
  Route<{
    key: string,
    icon: string,
    title: string,
    color: string,
  }>
>;

export default class MainActivity extends React.Component {
  state = {
    index: 1,
    routes: [
      { key: 'cad', icon: 'printer-3d', color: '#FFFFFF', title: 'CAD'},
      { key: 'track', icon: 'map-marker-radius', color: '#FFFFFF', title: 'Track'},
      { key: 'data', icon: 'chart-line', color: '#FFFFFF', title: 'Data'},
    ],
  }

  static navigationOptions =
  {
     header: null,
  };

  OpenSettingsFunction = () => { this.props.navigation.navigate('SettingsActivity'); }

  ShareMessage=()=> {
    Share.share({      
      message: "I'm tracking EQUiSat, Brown University's first-ever satellite, using the EQUiSat App! equisat.brownspace.org",        
    });
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

  _handleIndexChange = index =>
    this.setState({
    index,
  });

   _renderScene = SceneMap({
    cad: CADFragment,
    track: TrackFragment,
    data: DataFragment,
  });

  _renderIcon = ({ route }) => (    
    <Icon name={route.icon} size={24} style={styles.icon} />
  );

  _renderBadge = ({ route }) => {
    if (route.key === '2') {
      return (
        <View style={styles.badge}>
          <Text style={styles.count}>42</Text>
        </View>
      );
    }
    return null;
  };

  _renderTabBar = props => (    
    <TabBar
      {...props}
      renderIcon={this._renderIcon}      
      renderBadge={this._renderBadge}      
      indicatorStyle={styles.indicator}
      labelStyle={styles.label}
      style={styles.tabbar}
    />
  );

  render() {
    return (      
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{ flex: 1 }}>
          <StatusBarBackground/>
          <Toolbar 
            centerElement="EQUiSat" 
            rightElement={{
              actions: ['share',],
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
                  break;
              }
            }}
            style={{container: {elevation: 0,}}}
          />
          <TabView
            style={this.props.style}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            tabBarPosition="bottom"
            onIndexChange={this._handleIndexChange}
            swipeEnabled={false}
          />
        </View>
      </ThemeProvider>
    );
  }
}