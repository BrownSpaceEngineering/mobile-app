import React, {Component} from 'react';
import { Dimensions, FlatList, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { DialogComponent, DialogTitle}from 'react-native-dialog-component';
import { Button } from 'react-native-material-ui';

import LatestDataFragment from "./LatestDataFragment.js";
import HistoricalDataFragment from "./HistoricalDataFragment.js"

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
    width: Dimensions.get('window').width / 2,
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default class DataFragment extends React.Component {

  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Latest' },
      { key: 'second', title: 'Historical' },
    ],
    refreshList: false,
  }

  constructor(props) {
    super(props);
    this.tableUpdate = this.tableUpdate.bind(this);
  }

  tableUpdate(e) {        
    this.setState({ refreshList: !this.state.refreshList });    
    this.tableDialog.show();
  }

  LatestView = () => (
    <LatestDataFragment/>
  );

  HistoricalView = () => (
    <HistoricalDataFragment tableUpdate={this.tableUpdate} ref={historicalDataFragment => {this.historicalDataFragment = historicalDataFragment}}/>
  );

  _handleIndexChange = index => this.setState({ index, });

  _renderScene = SceneMap({
    first: this.LatestView,
    second: this.HistoricalView,
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

  hideTableDialog = () => this.tableDialog.dismiss();

  renderTableDialogComponent() {
    if (this.historicalDataFragment) {
      return (
      <DialogComponent
        ref={(dialogComponent) => { this.tableDialog = dialogComponent }}
        title={<DialogTitle titleTextStyle={{color: "#e5e5e5"}} title={this.historicalDataFragment.state.selectedItems.length > 0 ? this.historicalDataFragment.state.selectedItems[this.historicalDataFragment.state.tableListItemNum] : ""} />}
        width={0.9}
        dialogStyle={{backgroundColor: "#19222a"}} >      
          <View style={{alignItems: 'center'}}>
            <View style={styles.rowContainer} >
            <Text style={{fontSize: 16, color: this.historicalDataFragment.colors[this.historicalDataFragment.state.tableListItemNum]}}>#</Text>
            <Text style={{fontSize: 16, color: this.historicalDataFragment.colors[this.historicalDataFragment.state.tableListItemNum]}}>TIMESTAMP</Text>
            <Text style={{fontSize: 16, color: this.historicalDataFragment.colors[this.historicalDataFragment.state.tableListItemNum]}}>VALUE</Text>
            </View>
            <FlatList
              data={this.historicalDataFragment.state.tableData}
              //data={[{key: "1"}, {key: "1"}, {key: "2"}, {key: "3"}, {key: "4"}, {key: "5"}, {key: "6"}]}
              extraData={this.state}
              ItemSeparatorComponent={this.historicalDataFragment.FlatListItemSeparator}
              horizontal={false}
              numColumns={3}
              renderItem={({item, index}) => <View style={{alignItems: 'center'}}><Text style={[{color: this.historicalDataFragment.colors[this.historicalDataFragment.state.tableListItemNum], fontSize: 16, textAlign: "center", marginRight: 10, marginLeft: 10 }]}>{item.key}</Text></View>}
            />
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 10}}>
              <Button accent text="Close" onPress={this.hideTableDialog} />
            </View>
          </View>
      </DialogComponent>
    );
    } else {
      return <View/>
    }   
  }

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
          {this.renderTableDialogComponent()}
        </View>
      );    
  }
}
