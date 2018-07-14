import React from 'react';
import { ActivityIndicator, Alert, Dimensions, Linking, StyleSheet, Text, View, Image, ScrollView, Share, StatusBar, WebView } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, COLOR, BottomNavigation, Dialog, DialogDefaultActions, ThemeProvider, Toolbar } from 'react-native-material-ui';
import { TabView, TabBar, SceneMap, type Route, type NavigationState } from 'react-native-tab-view';
import { Font, Location, Permissions } from 'expo';
import { DialogComponent, DialogTitle}from 'react-native-dialog-component';

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
  },
  aboutText: {
    fontSize: 17,
    color: "#e5e5e5",
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
      case "info-outline":
        {this.aboutDialog.show();}
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

  hideAboutDialog = () => this.aboutDialog.dismiss();

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
              actions: ['share', 'info-outline'],              
            }}
            searchable={this.state.searchButton}
            onRightElementPress={(e) => this.onactionItemselected(e)}
            style={{container: {elevation: 0,}}}
            isSearchActive={this.state.searchBarOpen}
          />
          <DialogComponent
            ref={(dialogComponent) => { this.aboutDialog = dialogComponent; }}
            title={<DialogTitle titleTextStyle={{color: "#e5e5e5"}} title="About" />}
            width={0.9}
            dialogStyle={{backgroundColor: "#19222a"}}            
          >
            <ScrollView>
              <View style={{padding: 10}}>
                <View style={{alignItems: 'center'}}>
                  <Image source={require('../assets/bse_logo_name_white.png')} />
                </View>
                <Text style={[styles.aboutText, {paddingTop: 5}]}>{"Created by Brown Space Engineering, a team of superheroes/undergraduates at Brown University. Design/Implementation by Willem Speckmann & Tyler Fox. \n\nTrack EQUiSat on the Web: "} </Text>
                <Text style={[styles.aboutText, {color: '#6aa2c8'}]} onPress={() => {Linking.openURL('http://equisat.brownspace.org')}}> http://equisat.brownspace.org </Text>
                <Text style={styles.aboutText} >{"Learn more about EQUiSat: "} </Text>
                <Text style={[styles.aboutText, {color: '#6aa2c8'}]} onPress={() => {Linking.openURL('http://brownspace.org/EQUiSat')}}> https://brownspace.org/EQUiSat </Text>
                <Text style={styles.aboutText} >{"Learn more about the club and see what other projects we are working on: "} </Text>
                <Text style={[styles.aboutText, {color: '#6aa2c8'}]} onPress={() => {Linking.openURL('http://brownspace.org')}}> https://brownspace.org </Text>
                <View style={{alignItems: 'center'}}>
                  <Text style={[styles.aboutText, {paddingBottom: 5}]} >{"\nHelp support our student-run club "} </Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Button raised accent style={{container: {width: 200}}} text=" Donate Now" icon={<Icon name="heart" size={17} style={styles.icon} />} onPress={() => {Linking.openURL('http://brownspace.org/donate')}} />              
                </View>
                <Text style={styles.aboutText} >{"\nFollow us for updates:"} </Text>
                <View style={[styles.rowContainer, {marginTop: 15}]}>
                  <Button raised accent style={{container: {width: 50, height: 50, padding: 0}}} text="" icon={<Icon name="facebook" size={20} style={styles.icon} />} onPress={() => {Linking.openURL('http://facebook.com/browncubesat')}} />
                  <Button raised accent style={{container: {width: 50, height: 50, padding: 0}}} text="" icon={<Icon name="twitter" size={20} style={styles.icon} />} onPress={() => {Linking.openURL('http://twitter.com/browncubesat')}} />
                  <Button raised accent style={{container: {width: 50, height: 50, padding: 0}}} text="" icon={<Icon name="github-circle" size={20} style={styles.icon} />} onPress={() => {Linking.openURL('http://facebook.com/browncubesat')}} />
                </View>
                <View style={{paddingTop: 10, flexDirection: 'row', justifyContent: 'center',}}>
                  <Image style={{marginRight: 30}} source={require('../assets/fire_emoji.png')} />
                  <Image source={require('../assets/100_emoji.png')} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 10}}>
                  <Button accent text="Close" onPress={this.hideAboutDialog} />
                </View>
              </View>          
            </ScrollView>

          </DialogComponent>
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