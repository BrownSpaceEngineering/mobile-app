//'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  labelStyle: {    
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
  rowContainer: {    
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

class VerticalDataValue extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number.isRequired
    ]),
    color: PropTypes.string.isRequired,
  }

  render() {
    const { label, value, color } = this.props;    
    return(
      <View>        
        <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: color }}>{value}</Text>
        <Text style={styles.labelStyle}>{label}</Text>
      </View>
    );
  }
}

module.exports= VerticalDataValue