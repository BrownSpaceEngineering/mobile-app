import React, {Component} from 'react';
import { Alert, Platform, StyleSheet, Text, View, Image, Dimensions, TouchableHighlight, DeviceEventEmitter} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-material-ui';
import ActionButton from 'react-native-action-button';
import { Location, Permissions } from 'expo';
import SnackBar from 'react-native-snackbar-component';
import axios from 'axios';
import { SensorManager } from 'NativeModules';

const degree_update_rate = 3; // Number of degrees changed before the callback is triggered

const TLEJS = require('tle.js');
const tlejs = new TLEJS();
const trackServerPrefix = "http://tracking.brownspace.org/api/"

const isAndroid = (Platform.OS === 'android');
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class FindFragment extends React.Component {
  constructor() {
    super();
  }

  state = {
    userAzimuth: 0,
    userLat: 0,
    userLong: 0,
    userAlt: 0,
    userPitch: 0,
    satElevation: 0,
    satAzimuth: 0,
    userRoll: 0,
  }

  componentDidMount() {
    this._getLocationAsync(); //get user location
    this.getTLE(this);
    var _this = this;
    //get sat location every second
    this.satUpdateAsyncID = setInterval(function(){_this.updateSatLocation(_this);}, 2000);

    SensorManager.startOrientation(200);

    DeviceEventEmitter.addListener('Orientation', function (data) {
      this.setState({userAzimuth: data.azimuth, userPitch: data.pitch, userRoll: data.roll});
    }.bind(this));
  }

  componentWillUnmount() {
    clearInterval(this.satUpdateAsyncID);
    SensorManager.stopOrientation();
  }

  TLEStr = '1998-067PA\n1 43552U 98067PA  18203.24282627  .00006515  00000-0  10313-3 0  9994\n2 43552  51.6412 203.9371 0005837 350.6408   9.4476 15.54781596  1354'

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
  };

  getTLE(_this) {
    _this.serverRequest =
      axios
        .get(trackServerPrefix + 'equisat_tle?timestamp='+new Date().getTime())
        .then(function(result) {
          console.log('TLE data');
          console.log(result.data);
          var TLEStr = result.data;
          if (TLEStr.slice(-1) == '\n') {
            TLEStr = TLEStr.slice(0, -1);
          }
          if (TLEStr != "") {
            _this.TLEStr = TLEStr;
          } else {
            console.log("Received blank TLE");
          }
          console.log(_this.TLEStr);
          // _this.setState({ TLEReady: true });
          _this.setOrbitPathCoords(_this);
          setInterval(function(){_this.setOrbitPathCoords(_this);}, 1000*60*5);
        })
        .catch(function (error) {
          _this.setState({ TLEReady: true });
          _this.setOrbitPathCoords(_this);
          setInterval(function(){_this.setOrbitPathCoords(_this);}, 1000*60*5);
          console.log("ERR1: " + error);
        });
  };

  updateSatLocation(_this) {
    if (_this.state.TLEReady) {
      curSatInfo = tlejs.getSatelliteInfo(
        _this.TLEStr,
        Date.now(),
        _this.state.userLat,
        _this.state.userLong,
        _this.state.userAlt
      );
      const azimuth = curSatInfo.azimuth;
      const elevation = curSatInfo.elevation;
      _this.setState({satAzimuth: azimuth, satElevation: elevation})
    };
  };

  getUserAzimuth = (_this) => {
    const azimuth = (_this.state.userAzimuth - _this.state.userRoll) % 360;

    if (azimuth < 0) {
      return azimuth + 360;
    } else {
      return azimuth;
    }
  }

  getUserPitch = (_this) => {
    let pitch = _this.state.userPitch - 270;
    if (_this.state.userRoll > 270 || _this.state.userRoll < 90) {
      pitch = pitch * (-1);
    }
    if (pitch > 180) {
      return pitch - 360;
    } else if (pitch < -180) {
      return pitch + 360;
    } else {
      return pitch;
    }
  }

  getAzimuthDelta = (_this) => {
    const azimuth = (_this.state.userAzimuth - _this.state.userRoll) % 360;
    let diff;

    if (azimuth < 0) {
      diff = _this.state.satAzimuth - (azimuth + 360);
    } else {
      diff = _this.state.satAzimuth - azimuth;
    }

    if (diff > 180) {
      diff = diff - 360
    }
    else if (diff < - 180) {
      diff = diff + 360
    }

    if (diff < -40) {
      return '10%';
    } else if (diff > 40) {
      return '90%';
    } else {
      return (45 + diff).toString() + '%';
    }
  }

  getAltitudeDelta = (_this) => {
    let pitch = _this.state.userPitch - 270;
    if (_this.state.userRoll > 270 || _this.state.userRoll < 90) {
      pitch = pitch * (-1);
    }
    if (pitch > 180) {
      pitch = pitch - 360;
    } else if (pitch < -180) {
      pitch = pitch + 360;
    }

    let diff = _this.state.satElevation - pitch;

    if (diff > 180) {
      diff = diff - 360
    }
    else if (diff < - 180) {
      diff = diff + 360
    }

    console.log(diff);
    
    if (diff < -40) {
      return '90%';
    } else if (diff > 40) {
      return '10%';
    } else {
      return (40 - diff).toString() + '%';
    }
  }

  render() {
    return(
      <View style={{backgroundColor: 'black', height: '100%', width: '100%'}}> 
        <Icon 
          name='crosshairs'
          color='white'
          size={30}
          style={{
            left: '50%',
            top: '45%'
          }}
        />
        <Image
          style={{width: 50, height: 50, top: this.getAltitudeDelta(this), left: this.getAzimuthDelta(this)}}
          source={isAndroid ? require('../assets/equisat_logo_white_android.png') : require('../assets/equisat_logo_white.png') }
        />
      </View>
    )
  }
}
