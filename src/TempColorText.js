//'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  labelStyle: {    
    textAlign: 'center',
    color: 'white',
  }
});

class TempColorText extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    temp: PropTypes.string.isRequired,    
  }

  getTemperatureColor(tempInC) {
    // Map the temperature to a 0-1 range
    if (tempInC < -40) {
        tempInC = -40;
    }
    if (tempInC > 90) {
        tempInC = 90;
    }
    var a = (tempInC + 60)/130;
    a = (a < 0) ? 0 : ((a > 1) ? 1 : a);
    
    // Scrunch the green/cyan range in the middle
    var sign = (a < .5) ? -1 : 1;
    a = sign * Math.pow(2 * Math.abs(a - .5), .35)/2 + .5;
    
    // Linear interpolation between the cold and hot
    var h0 = 259;
    var h1 = 12;
    var h = (h0) * (1 - a) + (h1) * (a);
    
    //return pusher.color("hsv", h, 75, 90).hex6();
    return ["hsl(",h,",100%,65%)"].join("");
}

  render() {
    const { label, temp } = this.props;
    var tempNum = parseFloat(temp);      
    var color = isNaN(tempNum) ? "#e5e5e5" : this.getTemperatureColor(tempNum);
    return(
      <View>
        <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: color }}>{temp}°C</Text>
        <Text style={styles.labelStyle}>{label}</Text>
      </View>
    );
  }
}

module.exports= TempColorText