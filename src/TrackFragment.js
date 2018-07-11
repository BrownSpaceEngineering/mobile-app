import React, {Component} from 'react';
import { Alert, Platform, StyleSheet, Text, View, Image} from 'react-native';
import MapView from 'react-native-maps';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-material-ui';
import ActionButton from 'react-native-action-button';
import { Location, Permissions } from 'expo';
import SnackBar from 'react-native-snackbar-component';
import axios from 'axios';
import 'es6-symbol/implement';
import DialogInput from 'react-native-dialog-input';

const mapStyle = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#d7dee5"},{"lightness":40},{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#19222a"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#19222a"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#257bcb"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#d7dee5"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"},{"lightness":"52"},{"weight":"1"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#d7dee5"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#d7dee5"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#d7dee5"},{"lightness":"14"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d7dee5"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#d7dee5"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#d7dee5"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7dee5"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#19222a"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#19222a"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"on"}]}]

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

const trackServerPrefix = "http://tracking.brownspace.org/api/"

//TLE Stuff
const TLEJS = require('tle.js');
const tlejs = new TLEJS();
const satName = 'ISS (ZARYA)';


const isAndroid = (Platform.OS === 'android');
const satMarkerImage = require('../assets/equisat_logo_white.png');
const satMarkerImage_android = require('../assets/equisat_logo_white_android.png');
const userMarkerImage_ = require('../assets/user_location_icon.png');
const userMarkerImage_android = require('../assets/user_location_icon_android.png');

const nextPassErrorStr = "Could not determine next EQUiSat pass over this location. Try again later.";

export default class TrackFragment extends React.Component {

  state = {
    mapLat: 0,
    mapLong: 0,    
    curSatInfo: {lat: 0, lng: 0, height: 0, velocity: 0},
    satLocButtonSize: 60,
    satCoord: {latitude: 0, longitude: 0},
    satCoords: [],
    lockedToSatLoc: true,

    TLEReady: false,  

    searchText: "",
    searchLat: 0,
    searchLong: 0,
    searchNextPass: {max_alt: 0, max_alt_time: 0, rise_azimuth: 0, rise_time: 0, set_azimuth: 0, set_time: 0},
    searchNextPassError: true,
    showSearchLocMarker: false,
    searchErrorSnackbarVisible: false,    

    userLat: 0,
    userLong: 0,
    userAlt: 0,
    userLocErrorSnackbarVisible: false,
    gotUserLoc: false,    
    showUserLoc: false,
    showUserLocMarker: false,
    userNextPass: {max_alt: 0, max_alt_time: 0, rise_azimuth: 0, rise_time: 0, set_azimuth: 0, set_time: 0},
    userNextPassError: true,


    notifyInputNumberDialogVisible: false,
    notifyLat: 0,
    notifyLon: 0,
    notifyStatusSnackbarVisible: false,
    notifyStatusSnackbarText: "",
  }

  TLEStr = 'ISS (ZARYA)\n1 25544U 98067A   18167.57342809  .00001873  00000-0  35452-4 0  9993\n2 25544  51.6416  21.7698 0002962 191.5103 260.7459 15.54186563118420';

  printDate(date) {
    // Create an array with the current month, day and time
      var dateArr = [ date.getMonth() + 1, date.getDate(), date.getFullYear() ];
    // Create an array with the current hour, minute and second
      var timeArr = [ date.getHours(), date.getMinutes() ];
    // Determine AM or PM suffix based on the hour
      var suffix = ( timeArr[0] < 12 ) ? "AM" : "PM";
    // Convert hour from military time
      timeArr[0] = ( timeArr[0] < 12 ) ? timeArr[0] : timeArr[0] - 12;
    // If hour is 0, set it to 12
      timeArr[0] = timeArr[0] || 12;
    // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( timeArr[i] < 10 ) {
          timeArr[i] = "0" + timeArr[i];
        }
      }
    // Return the formatted string
      return dateArr.join("/") + " at " + timeArr.join(":") + " " + suffix;
}  

  getNextPass(_this, lat, lon, alt, isUserLoc) {
    this.setState({ lockedToSatLoc: false });
    _this.serverRequest = 
      axios
        .get(trackServerPrefix + "get_next_pass/"+ satName + "/" + lon + "," + lat + "," + alt)
        .then(function(result) {
          var isError = (result.status != 200);          
          if (isUserLoc) {
            _this.setState({ userNextPassError: isError })
            _this.setState({ userNextPass: result.data });
          } else {
            _this.setState({ searchNextPassError: isError })
            _this.setState({ searchNextPass: result.data });
            setTimeout(function(){ _this.searchLocMarker.showCallout(); }, 1000);
          }
        })
        .catch(function (error) {
          console.log(error);
          return undefined; });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      var _this = this;
      _this.setState({ locErrorSnackbarVisible: true })
      setTimeout(function(){_this.setState({ locErrorSnackbarVisible: false })}, 5000);
    }
    var location = await Location.getCurrentPositionAsync({});      
    var userLat = location.coords.latitude;
    var userLong = location.coords.longitude;
    var userAlt = location.coords.longitude;
    this.setState({ userLat });
    this.setState({ userLong });
    this.setState({ userAlt });
    this.setState({ gotUserLoc: true });
    this.getNextPass(this, userLat, userLong, userAlt, true);
    this.setState({ showUserLocMarker: true });
  };

  getTLE = async (_this) => {
    _this.serverRequest =
      axios
        .get(trackServerPrefix + 'equisat_tle')
        .then(function(result) {
          console.log(TLEStr);
          var TLEStr = result.data.slice(0, -1);
          if (TLEStr != "") {
            _this.TLEStr = TLEStr;
          } else {
            console.log("Received blank TLE");
          }
          _this.setState({ TLEReady: true });
        })
        .catch(function (error) {
          _this.setState({ TLEReady: true });
          console.log(error);
        });
  };

  updateSatLocation(_this) {
    if (_this.state.TLEReady) {
      curSatInfo = tlejs.getSatelliteInfo(this.TLEStr, Date.now(), 0, 0, 0);
      var latitude = curSatInfo.lat;
      var longitude = curSatInfo.lng;
      let satCoord = {latitude: latitude, longitude: longitude};
      _this.setState({ satCoord });
      
      curSatInfo["height"] = curSatInfo["height"].toFixed(2);
      curSatInfo["velocity"] = curSatInfo["velocity"].toFixed(2);
      _this.setState({ curSatInfo });
      if (_this.state.lockedToSatLoc) {
        let region = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 50,
          longitudeDelta: 50,
        }
        _this.map.animateToRegion(region);
      }
    }
  }

makeSearchMarker(location) {
  var searchLat = location.latitude;
  var searchLong = location.longitude;
  this.setState({ searchLat });
  this.setState({ searchLong });
  this.setState({ showSearchLocMarker: true})
  let region = {
    latitude: searchLat,
    longitude: searchLong,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  }
  this.map.animateToRegion(region);
  this.getNextPass(this, searchLat, searchLong, 0, false);
}

  _getGeocodeLatLong = async () => {
    this.setState({ lockedToSatLoc: false });
    this.setState({showSearchSpinner: true});
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({ locErrorSnackbarVisible: true });
      var _this = this;
      setTimeout(function(){_this.setState({ locErrorSnackbarVisible: false })}, 5000);
    }    
    var locations = await Location.geocodeAsync(this.state.searchText);
    if (locations.length == 0) {
      this.setState({ searchErrorSnackbarVisible: true });
      var _this = this;
      setTimeout(function(){_this.setState({ searchErrorSnackbarVisible: false })}, 5000);
    } else {
      this.makeSearchMarker(locations[0]);
    }    
    this.setState({ showSearchSpinner: false });
    this.setState({ searchBarOpen: false });  
  };

  setOrbitPathCoords(orbitLineArr) {
    var satCoords = [];
    for (var i = 0; i < orbitLineArr.length; i++) {
      satCoords = [ ...satCoords, {latitude: orbitLineArr[i][0], longitude: orbitLineArr[i][1]}];
    }
    this.setState({ satCoords });
  }

  componentDidMount() {
    this._getLocationAsync(); //get user location
    var _this = this;
    this.getTLE(this);
    //get sat location every second
    var orbitLines = tlejs.getGroundTrackLatLng(this.TLEStr);
    console.log(orbitLines);
    this.setOrbitPathCoords(orbitLines[1]);
    this.satUpdateAsyncID =setInterval(function(){_this.updateSatLocation(_this);}, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.satUpdateAsyncID);
  }

  showUserLoc() {
    this.setState({ lockedToSatLoc: false });
    this.setState({ showUserLoc: true });
    let region = {
      latitude: this.state.userLat,
      longitude: this.state.userLong,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }
    this.map.animateToRegion(region);
    var _this = this;
    setTimeout(function(){ _this.userLocMarker.showCallout(); }, 300);
  }

  snapToSat() {
    this.setState({ lockedToSatLoc: true })
    let region = {
      latitude: this.state.satCoord.latitude,
      longitude: this.state.satCoord.longitude,
      latitudeDelta: 50,
      longitudeDelta: 50,
    }
    this.map.animateToRegion(region);
  
  }

  showCalloutText(userLoc) {
    var isError = userLoc ? this.state.userNextPassError : this.state.searchNextPassError;
    var nextPass = userLoc ? this.state.userNextPass : this.state.searchNextPass;
    if (isError) {
      return <Text>{nextPassErrorStr}</Text>;
    } else {
      return (
        <View style={{flex: 1}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Next Pass</Text>
          <Text>Rise Time: {this.printDate(new Date(nextPass.rise_time *1000))}</Text>
          <Text>Rise Azimuth: {nextPass.rise_azimuth.toFixed(2)}°</Text>
          <Text>Max Alt.: {nextPass.max_alt.toFixed(2)}°</Text>
          <Text>Max Alt. Time: {this.printDate(new Date(nextPass.max_alt_time *1000))}</Text>
          <Text>Set Azimuth: {nextPass.set_azimuth.toFixed(2)}°</Text>
          <Text>Set Time: {this.printDate(new Date(nextPass.set_time *1000))}</Text>
          <Button accent text="Notify Me" />
        </View>
      );
    }
  }

  notifyNextPass(isError, lat, lon) {
    if (!isError) {
      this.setState({ notifyLat: lat });
      this.setState({ notifyLon: lon });
      this.setState({notifyInputNumberDialogVisible: true});      
    }
  }

  registerNumber(phoneNumber) {
    var _this = this;
    axios
      .get(trackServerPrefix + 'register/' + phoneNumber + ',' + _this.state.notifyLat + ',' + _this.state.notifyLon)
      .then(function(result) {        
        _this.setState({ notifyStatusSnackbarText: (result.data.success ? "Successfully registered for SMS notifications" : "Error registering for SMS notifications") });
        _this.setState({ notifyStatusSnackbarVisible: true });      
        setTimeout(function(){_this.setState({ notifyStatusSnackbarVisible: false })}, 5000);
        return result.data.success;     
      })
      .catch(function (error) {              
        console.log(error);
        _this.setState({ notifyStatusSnackbarText: "Error registering for SMS notifications" });
        _this.setState({ notifyStatusSnackbarVisible: true });
        setTimeout(function(){_this.setState({ notifyStatusSnackbarVisible: false })}, 5000);
        return false;
      });
  }

  subscribeSMSNotifications(phoneNumber) {
    var _this = this;
    //check if number alraedy exists
    axios
      .get(trackServerPrefix + 'number_exists/' + phoneNumber)
      .then(function(result) {
        if (result.data.number) {
          //Warn first
          Alert.alert(
            'Change Location?',
            'Do you want to overwrite your previous location (' + result.data.lat + ', ' + result.data.lon + ') and get updates for (' + _this.state.notifyLat + ', ' + _this.state.notifyLon + ') instead?',
            [
              {text: 'No'},
              {text: 'Yes', onPress: () => _this.registerNumber(phoneNumber)},
            ],
            { cancelable: false }
          );
        } else {
          //subscribe
          _this.registerNumber(phoneNumber);
        }
      })
      .catch(function (error) {        
        _this.setState({ notifyStatusSnackbarText: "Error contacting SMS notification server"});
        _this.setState({ notifyStatusSnackbarVisible: true });
        setTimeout(function(){_this.setState({ notifyStatusSnackbarVisible: false })}, 5000);
        console.log(error);
      });
  }

  render() {    
    return(
      <View 
        style={styles.container}        
      >        
        <MapView          
          onPanDrag={e => this.setState({ lockedToSatLoc: false })}
          onLongPress={e => this.makeSearchMarker(e.nativeEvent.coordinate)}
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
            image={isAndroid ? userMarkerImage_android : null}
            opacity={this.state.showUserLocMarker ? 1.0 : 0 }
          >
            {isAndroid ? null : <Image source={userMarkerImage} style={{width:40, height:40}} resizeMode="contain" />}
            <MapView.Callout onPress={e => this.notifyNextPass(this.state.userNextPassError, this.state.userLat, this.state.userLong)} >              
              {this.showCalloutText(true)}
            </MapView.Callout>
          </MapView.Marker>

          <MapView.Marker
            ref={ref => { this.searchLocMarker = ref; }}
            coordinate={{
              latitude: this.state.searchLat,
              longitude: this.state.searchLong
            }}
            opacity={this.state.showSearchLocMarker ? 1.0 : 0}
          >
            <MapView.Callout onPress={e => this.notifyNextPass(this.state.searchNextPassError, this.state.searchLat, this.state.searchLong)}>
              {this.showCalloutText(false)}
            </MapView.Callout>
          </MapView.Marker>

          <MapView.Marker.Animated
            ref={ref => { this.satMarker = ref; }}
            coordinate={ this.state.satCoord }
            image={isAndroid ? satMarkerImage_android : null}
            opacity={(this.state.satCoord.latitude != 0 || this.state.satCoord.latitude != 0)  ? 1.0 : 0}
          >
            {isAndroid ? null : <Image source={satMarkerImage} style={{width:40, height:40}} resizeMode="contain" />}
            <MapView.Callout>
              <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>EQUiSat</Text>
              <Text>Latitude: {this.state.curSatInfo.lat}</Text>
              <Text>Longitude: {this.state.curSatInfo.lng}</Text>
              <Text>Altitude: {this.state.curSatInfo.height}km</Text>
              <Text>Velocity: {this.state.curSatInfo.velocity}km/s</Text>
            </MapView.Callout>
          </MapView.Marker.Animated>
          
          <MapView.Polyline            
            coordinates={this.state.satCoords}
            strokeWidth={5}
            strokeColor={uiTheme.palette.accentColor}/>
        </MapView>        
        <ActionButton 
          buttonColor={uiTheme.palette.accentColor}
          size={this.state.gotUserLoc ? 60 : 0}
          renderIcon={active => active ? (<Icon name="crosshairs-gps" style={styles.actionButtonIcon} /> ) : (<Icon name="crosshairs-gps" style={styles.actionButtonIcon} />)}
          offsetX={15}
          offsetY={90}
          fixNativeFeedbackRadius={true}
          userNativeFeedback={true}          
          onPress={() => { this.showUserLoc() }}
        />
        <ActionButton 
          buttonColor={uiTheme.palette.accentColor}
          size={60}
          renderIcon={active => active ? (<EQUiSatIcon/> ) : (<EQUiSatIcon/>)}
          offsetX={15}
          offsetY={15}
          fixNativeFeedbackRadius={true}
          userNativeFeedback={true}          
          onPress={() => { this.snapToSat() }}
        />
        <SnackBar visible={this.state.userLocErrorSnackbarVisible} textMessage="Can't get location: Permission Denied" actionHandler={()=>{this.setState({userLocErrorSnackbarVisible: false})}} actionText="OK"/>
        <SnackBar visible={this.state.searchErrorSnackbarVisible} textMessage="No results for location" actionHandler={()=>{this.setState({searchErrorSnackbarVisible: false})}} actionText="OK"/>
        <SnackBar visible={this.state.notifyStatusSnackbarVisible} textMessage={this.state.notifyStatusSnackbarText}/>
        <DialogInput isDialogVisible={this.state.notifyInputNumberDialogVisible}
            ref={(input) => { this.numberInput = input; }}
            title={"Subscribe to SMS Notifications"}
            message={"Enter phone number to receive SMS notifications for EQUiSat passes."}
            hintInput ={"Phone number"}
            submitText={"Register"}
            textInputProps={{keyboardType: "phone-pad", autoFocus: true}}
            defaultValue={"TEST"}
            submitInput={ (inputText) => {this.subscribeSMSNotifications(inputText); this.setState({ notifyInputNumberDialogVisible: false })} }
            closeDialog={ () => {this.setState({ notifyInputNumberDialogVisible: false })}}>
        </DialogInput>
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