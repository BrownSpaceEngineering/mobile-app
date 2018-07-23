//'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

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
  on: {
    backgroundColor: 'transparent',
    color: 'yellow',
  },
  off: {
    backgroundColor: 'transparent',
    color: 'grey',
  },
});

class PhotodiodeValue extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    num: PropTypes.number.isRequired,    
  }

  render() {
    const { label, num} = this.props;    
    return(
      <View style={{paddingVertical: 5}} >        
        <View style={styles.rowContainer}>           
          <Icon name="white-balance-sunny" size={24} style={num > 0 ? styles.on : styles.off} />
          <Icon name="white-balance-sunny" size={24} style={num > 1 ? styles.on : styles.off} />
          <Icon name="white-balance-sunny" size={24} style={num > 2 ? styles.on : styles.off} />          
        </View>
        <Text style={styles.labelStyle}>{label}</Text>
      </View>
    );
  }
}

module.exports= PhotodiodeValue