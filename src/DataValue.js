//'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  labelStyle: {    
    textAlign: 'center',
    color: 'white',
  },
  rowContainer: {    
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

class DataValue extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }

  render() {
    const { label, value, color } = this.props;    
    return(
      <View style={styles.rowContainer}>
        <Text style={styles.labelStyle}>{label}:</Text>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: color }}>{value}</Text>
      </View>
    );
  }
}

module.exports= DataValue