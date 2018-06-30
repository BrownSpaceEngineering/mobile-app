//'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  labelStyle: {    
    textAlign: 'left',
    color: 'white',
    fontSize: 14,
  },
  rowContainer: {    
    flexDirection: 'row',
    flex: 1,    
    alignItems: 'center',
  },
});

class HorizontalDataValue extends Component {
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
        <Text style={{ marginLeft: 5, textAlign: 'left', fontSize: 20, fontWeight: 'bold', color: color }}>{value}</Text>
      </View>
    );
  }
}

module.exports= HorizontalDataValue