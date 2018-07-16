import React, {Component} from 'react';
import { Dimensions, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import LatestDataFragment from "./LatestDataFragment.js";
import HistoricalDataFragment from "./HistoricalDataFragment.js"
import LastFlashDataFragment from "./LastFlashDataFragment.js"

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const accentColor= "#6aa2c8"

const styles = StyleSheet.create({  
  container: {
    flex: 1,
  },
  tab: {
    width: Dimensions.get('window').width / 3,
  },
  tabbar: {
    backgroundColor: '#19222a',
  },
  indicator: {
    backgroundColor: accentColor,
  },
  label: {
    color: '#fff',
    fontWeight: '400',
  },  
});

export default class DataFragment extends React.Component {

  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Latest' },
      { key: 'second', title: 'Historical' },
      { key: 'third', title: 'Last Flash' },
    ],    
  }

  LatestView = () => (
    <LatestDataFragment/>
  );

  HistoricalView = () => (
    <HistoricalDataFragment/>
  );
  LastFlashView = () => (
    <LastFlashDataFragment/>
  );

  _handleIndexChange = index =>
  this.setState({
    index,
  });

  _renderScene = SceneMap({
    first: this.LatestView,
    second: this.HistoricalView,
    third: this.LastFlashView,
  });

  _renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  );

  render() {
      return(
        <View style={styles.container}>          
          <TabView
            style={[styles.container, this.props.style]}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
          />
        </View>
      );    
  }
}
