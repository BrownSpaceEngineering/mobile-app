import React from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, View, Image, ScrollView, Share, StatusBar, WebView } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR, BottomNavigation, Dialog, DialogDefaultActions, ThemeProvider, Toolbar } from 'react-native-material-ui';
import { TabView, TabBar, SceneMap, type Route, type NavigationState } from 'react-native-tab-view';
import { Font, Location, Permissions } from 'expo';

import StatusBarBackground from './StatusBarBackground';
import TrackFragment from './TrackFragment';
import DataFragment from './DataFragment';
import CADFragment from './CADFragment';

const TOOLBAR_HEIGHT = 60;

global.uiTheme = {
    palette: {
        primaryColor: "#19222a",
        accentColor: "#6aa2c8",
        primaryTextColor: "#000000",
        secondaryTextColor: "#788ca1",
        alternateTextColor: "#FFFFFF"
    },
    toolbar: {
      container: {
        height: TOOLBAR_HEIGHT,
        backgroundColor: "#19222a",        
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
    tabbar: {
    backgroundColor: '#19222a',
    overflow: 'hidden',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  indicator: {
    backgroundColor: uiTheme.palette.accentColor,
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
  searchSpinner: {
    position: 'absolute',
    top: (STATUS_BAR_HEIGHT + TOOLBAR_HEIGHT / 2 - 17.5),
    alignSelf: 'flex-end',
    right: Dimensions.get('window').width / 8,
    zIndex: 100,
  }
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
  searchButton = {
    autoFocus: true,
    placeholder: 'Type a location for next pass',
    onChangeText: (text) => this.trackFragment.setState({ searchText: text }),
    onSubmitEditing: () => this.trackFragment._getGeocodeLatLong(),              
  };

  state = {
    index: 1,
    routes: [
      { key: 'cad', icon: 'printer-3d', color: '#FFFFFF', title: 'CAD'},
      { key: 'track', icon: 'map-marker-radius', color: '#FFFFFF', title: 'Track'},
      { key: 'data', icon: 'chart-line', color: '#FFFFFF', title: 'Data'},
    ],
    loading: true,
    showSearchSpinner: false,
    searchButton: this.searchButton,
    searchBarOpen: false,
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
    Font.loadAsync({
      'Roboto': require('../assets/fonts/Roboto-Medium.ttf'),
    });
    var _this = this;
    setTimeout(function(){_this.setState({ loading: false })}, 100);    
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

  _handleIndexChange = index => {
    this.setState({ index });    
    switch(index) {            
      case 1: //on track tab        
        if (this.state.searchButton == null) {
          this.setState({ searchButton: this.searchButton });
        }
        break;
      default: //otherwise
        if (this.state.searchButton != null) {
          this.setState({ searchButton: null });
        }        
        break;
    }
  }    

  _renderScene = ({ route }) => {
  switch(route.key) {
      case "cad":        
        return <CADFragment/>;
        break;
      case "track":                  
        return <TrackFragment ref={trackFragment => {this.trackFragment = trackFragment}}/>;
        break;
      case "data":        
        return <DataFragment/>;
        break;
    }
  }

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

  onactionItemselected(e) {
    switch(e.action) {
      case "share":
        {this.ShareMessage()}
        break;
      //case "settings":
      //  {this.OpenSettingsFunction()}
      /*case "menu":
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
        break;*/
    }
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading/>;
    } else {
      let searchSpinner = (this.state.showSearchSpinner) ? (<ActivityIndicator animating={this.state.showSearchSpinner} size="large" color="#19222a"  style={styles.searchSpinner}/>) : (null);
      return (      
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{ flex: 1 }}>
          <StatusBarBackground/>
          {searchSpinner}
          <Toolbar
            centerElement="EQUiSat" 
            rightElement={{
              actions: ['share'/*, 'settings'*/],
              //menu: { labels: ['Settings', 'About'] }
            }}
            searchable={this.state.searchButton}
            onRightElementPress={(e) => this.onactionItemselected(e)}
            style={{container: {elevation: 0,}}}
            isSearchActive={this.state.searchBarOpen}
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
}