import React, {Component} from 'react';
import { Alert, StyleSheet, Text, View, Image} from 'react-native';
import MapView from 'react-native-maps';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';
import { Location, Permissions } from 'expo';
import SnackBar from 'react-native-snackbar-component'

const mapStyle = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#19222a"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#257bcb"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#d7dee5"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"},{"lightness":"52"},{"weight":"1"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"},{"lightness":"14"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#19222a"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#19222a"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  actionButtonIcon: {
    fontSize: 23,
    height: 25,
    color: 'white',
  },
});

export default class TrackFragment extends React.Component {

  state = {
    mapLat: 0,
    mapLong: 0,
    satLat: 0,
    satLong: 0,
    satAltitude: 0,
    satLocButtonSize: 60,

    userLat: 0,
    userLong: 0,
    userLocErrorSnackbarVisible: false,
    gotUserLoc: false,
    userLocButtonSize: 0,
    showUserLoc: false,
    userLocOpacity: 0,
    userLocCalloutText: "EQUiSat will pass overhead you on 6/30/2018 at 7:00pm."
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status == 'granted') {
      var _this = this;
      _this.setState({ locErrorSnackbarVisible: true })
      setTimeout(function(){_this.setState({ locErrorSnackbarVisible: false })}, 5000);
    }
    var location = await Location.getCurrentPositionAsync({});    
    var userLat = location.coords.latitude;
    var userLong = location.coords.longitude;
    this.setState({ userLat });
    this.setState({ userLong });
    this.setState({ userLocButtonSize: 60 });
    this.setState({ userLocOpacity: 1.0 });
  };  

  componentDidMount() {
    this._getLocationAsync();
  }

  showUserLoc() {    
    this.setState({ showUserLoc: true });
    let region = {
      latitude: this.state.userLat,
      longitude: this.state.userLong,
      latitudeDelta: 50,
      longitudeDelta: 50
    }
    this.map.animateToRegion(region);    
    var _this = this;
    setTimeout(function(){ _this.userLocMarker.showCallout(); }, 300);
  }

  render() {
    return(
      <View style={styles.container}>
        <MapView
          ref={map => {this.map = map}}
          style={styles.map}
          initialRegion={{
            latitude: this.state.mapLat,
            longitude: this.state.mapLong,
            latitudeDelta: 50,
            longitudeDelta: 50
          }}
          customMapStyle={mapStyle}
          showsMyLocationButton={true}
          provider="google"
        >
          <MapView.Marker
            ref={ref => { this.userLocMarker = ref; }}
            coordinate={{
              latitude: this.state.userLat,
              longitude: this.state.userLong
            }}
            opacity={this.state.userLocOpacity}
          >
            <MapView.Callout>
              <Text>{this.state.userLocCalloutText}</Text>
            </MapView.Callout>
          </MapView.Marker>

          <MapView.Marker
            coordinate={{
              latitude: this.state.satLat,
              longitude: this.state.satLong
            }}
            //onPress={() => this.openModal()}
          >
            <Image
              source={require('../assets/logo.png')}
              style={{width:40, height:40}} />
          </MapView.Marker>
        </MapView>        
        <ActionButton 
          buttonColor="#6aa2c8"
          size={this.state.userLocButtonSize}
          renderIcon={active => active ? (<Icon name="crosshairs-gps" style={styles.actionButtonIcon} /> ) : (<Icon name="crosshairs-gps" style={styles.actionButtonIcon} />)}
          offsetX={15}
          offsetY={90}
          fixNativeFeedbackRadius={true}
          userNativeFeedback={true}          
          onPress={() => { this.showUserLoc() }}
        />
        <ActionButton 
          buttonColor="#6aa2c8"
          size={this.state.satLocButtonSize}
          renderIcon={active => active ? (<EQUiSatIcon/> ) : (<EQUiSatIcon/>)}
          offsetX={15}
          offsetY={15}
          fixNativeFeedbackRadius={true}
          userNativeFeedback={true}          
          onPress={() => { this.centerSatLoc() }}
        />
        <SnackBar visible={this.state.userLocErrorSnackbarVisible} textMessage="Can't get location: Permission Denied" actionHandler={()=>{this.setState({userLocErrorSnackbarVisible: false})}} actionText="OK"/>
      </View>
    );
  }
}

class EQUiSatIcon extends React.Component {
  render() {
    return (
      <Image
        source={require('../assets/equisat_logo_white.png')}
        fadeDuration={0}
        style={{width: 30, height: 30}}
      />
    );
  }
}