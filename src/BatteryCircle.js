//'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

const CHARGING_COLOR = "#00C853";
const DISCHARGING_COLOR = "#FF6D00";

const styles = StyleSheet.create({  
  rowContainer: {    
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  chargeLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

class BatteryCircle extends Component {
  static propTypes = {
    mV: PropTypes.number.isRequired,
    isLion: PropTypes.bool.isRequired,
    charging: PropTypes.bool.isRequired,
    dicharging: PropTypes.bool,
    number: PropTypes.number.isRequired,
  }

  lifepo4VoltageToPercentage(voltage) {
    //piecewise curve fit    
    var percentage = 0.;
    if (voltage >= 3.299) {
      percentage = 7481.35161972045*Math.pow(voltage, 5) - 129698.307311745*Math.pow(voltage, 4) + 899320.30659425*Math.pow(voltage, 3) - 3117698.8919505*Math.pow(voltage, 2) + 5403781.60634651*voltage - 3746176.3794266;
    } else if (voltage < 3.299 && voltage >= 3.168625) {
      percentage = -5538027.91287231*Math.pow(voltage, 5) + 89768047.5291653*Math.pow(voltage, 4) - 582052268.16249*Math.pow(voltage, 3) + 1887056369.17257*Math.pow(voltage, 2) - 3059070288.85044*voltage + 1983648268.20567;
    } else if (voltage < 3.168625 && voltage >= 2.4) {
      percentage = 9361.00030899047*Math.pow(voltage, 6) - 155484.297233582*Math.pow(voltage, 5) + 1074915.58123016*Math.pow(voltage, 4) - 3958921.17254791*Math.pow(voltage, 3) + 8192152.17593754*Math.pow(voltage, 2) - 9030097.66266999*voltage + 4142159.89895692;
    } else {
      percentage = 0;
    }    
    if (percentage < 0) {
      percentage = 0;
    }
    if (percentage > 100) {
      percentage = 100;
    }
    percentage = Math.round(percentage);    
    return percentage;
  }

  lionVoltageToPercentage(voltage) {
    //piecewise curve fit
    var percentage = 0.;
    if (voltage >= 3.986) {
      percentage = 495918.838867187*Math.pow(voltage, 6) - 12131731.9612119*Math.pow(voltage, 5) + 123643244.339164*Math.pow(voltage, 4) - 671989441.456614*Math.pow(voltage, 3) + 2054101328.6697*Math.pow(voltage, 2) - 3348296376.10735*voltage + 2273828011.07252;
    } else if (voltage < 3.986 && voltage >= 3.5985) {
      percentage = 14248.3732614517*Math.pow(voltage, 5) - 273888.006152098*Math.pow(voltage, 4) + 2105903.52769594*Math.pow(voltage, 3) - 8096118.96287537*Math.pow(voltage, 2) + 15563096.2967489*voltage - 11967212.7013982;
    } else if (voltage < 3.5985 && voltage >= 2.8) {
      percentage = 2942.12034556269*Math.pow(voltage, 5) - 48558.2340786669*Math.pow(voltage, 4) + 320492.380456582*Math.pow(voltage, 3) - 1057284.439237*Math.pow(voltage, 2) + 1743212.13657029*voltage - 1149073.13151426;
    } else {
      percentage = 0;
    }
    if (percentage < 0) {
      percentage = 0;
    }
    if (percentage > 100) {
      percentage = 100;
    }
    percentage = Math.round(percentage);
    return percentage;
  }

getBatteryColor(percentage){
    var value = percentage - 33;
    if (value < 0) {
      value = 0;
    }
    var scaledValue = (66 - value) / 66;
    //value from 0 to 1
    var hue=((.98-scaledValue)*130).toString(10);
    return ["hsl(",hue,",100%,65%)"].join("");
  }

  render() {
    const { mV, isLion, charging, discharging, number } = this.props;
    var voltage = (mV / 1000).toFixed(2);
    var percent = isLion ? this.lionVoltageToPercentage(voltage) : this.lifepo4VoltageToPercentage(voltage);
    var color = this.getBatteryColor(percent);    
    //var color = uiTheme.palette.accentColor;    
    return(
      <View>
        <AnimatedCircularProgress
          size={75}
          width={5}
          fill={percent}
          backgroundColor="#3d5875"
          tintColor={color} >
          {
            (fill) => (
              <View style={styles.chargeLabelContainer}>              
                <Text style={{ fontSize: 18, color: color, }}>
                  { voltage }V
                </Text>
                <View style={styles.rowContainer}>
                  {charging ? <Icon name="battery-charging" size={20} style={{backgroundColor: "transparent", color: 'white'}} /> : null}
                  {discharging ? <Icon name="battery-minus" size={20} style={{backgroundColor: "transparent", color: 'white'}} /> : null}
                </View>
              </View>
            )
          }
        </AnimatedCircularProgress>
        <Text style={{ fontSize: 15, color: color, textAlign: 'center', marginTop: 7}}> {number} </Text>
      </View>
    );
  }
}

module.exports= BatteryCircle