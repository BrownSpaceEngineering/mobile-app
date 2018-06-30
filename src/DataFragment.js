import React, {Component} from 'react';
import { Dimensions, StyleSheet, View, ScrollView, Text } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea } from "victory-native";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import ElevatedView from 'react-native-elevated-view';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';


import BatteryCircle from './BatteryCircle';
import TempColorText from './TempColorText';
import HorizontalDataValue from './HorizontalDataValue';
import VerticalDataValue from './VerticalDataValue';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

import {getSignalsLatestSingle} from '../api-library-js/EQUiSatAPI.js';

const accentColor= "#6aa2c8"

const styles = StyleSheet.create({
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#131a20',
  },
  rowContainer: {    
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  rowContainerLeft: {    
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
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
  card: {
    margin: 5,
    padding:10,
    flex: 1,
    backgroundColor: '#19222a',  
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 7.5,
  },
  cardSubtitle: {
    color: 'white',    
    fontSize: 18,
    marginBottom: 7,
  },
  cardText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  icon: {    
    backgroundColor: "transparent",
    color: "white",
    paddingRight: 5,
  },
});

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

export default class DataFragment extends React.Component {

  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Latest' },
      { key: 'second', title: 'Historical' },
    ],

    L1REF: 0,
    L2REF: 0,
    LF1REF: 0,
    LF2REF: 0,
    LF3REF: 0,
    LF4REF: 0,    
  }

  componentDidMount() {
    this.getBatteryVoltages();    
    getSignalsLatestSingle(["LF1REF", "LED3SNS"], 1529996366626, new Date().getTime())
       .then(function(result) {
          console.log(result.data);
        })
        .catch(function (error) {          
          console.log(error);
      });
  }  

  getBatteryVoltages() {
    this.setState({ L1REF: 3.94 });
    this.setState({ L2REF: 4.05 });
    this.setState({ LF1REF: 2.9 });
    this.setState({ LF2REF: 3.04 });  
    this.setState({ LF3REF: 3.2 });
    this.setState({ LF4REF: 3.22 });
  }

  LatestView = () => (
    <ScrollView style={{backgroundColor: "#131a20"}}>
      <View style={styles.dataContainer} >
          <View style={styles.rowContainer} >
            <ElevatedView elevation={5} style={styles.card} >
              <Text style={styles.cardTitle}>Last Transmission</Text>
              <View style={styles.rowContainerLeft} >
                <Icon name="clock" size={20} style={styles.icon} />
                <Text style={styles.cardText}>20 hours ago</Text>
              </View>
              <View style={styles.rowContainerLeft} >
                <Icon name="radio-tower" size={20} style={styles.icon} />
                <Text style={styles.cardText}>Brown University</Text>
              </View>
              <View style={styles.rowContainerLeft} >
                <Text style={styles.cardText}>Current State:  </Text>            
                <Text style={styles.cardText}>IDLE_FLASH</Text>
              </View>
            </ElevatedView>
            <ElevatedView elevation={5} style={styles.card} >
                                      
            </ElevatedView>
          </View>
          <ElevatedView elevation={5} style={styles.card} >
            <Text style={styles.cardTitle}>Battery Info</Text>
            <Text style={styles.cardSubtitle}>Li-Ion</Text>
            <View style={styles.rowContainer} >
              <BatteryCircle isLion={true} charging={true} discharging={true} number={1} voltage={this.state.L1REF} />
              <BatteryCircle isLion={true} charging={false} discharging={true} number={2} voltage={this.state.L2REF} />
            </View>
            <Text style={styles.cardSubtitle}>LiFePO4</Text>
            <View style={styles.rowContainer} >
              <BatteryCircle isLion={false} charging={false} number={1} voltage={this.state.LF1REF} />
              <BatteryCircle isLion={false} charging={false} number={2} voltage={this.state.LF2REF} />
              <BatteryCircle isLion={false} charging={false} number={3} voltage={this.state.LF3REF} />
              <BatteryCircle isLion={false} charging={false} number={4} voltage={this.state.LF4REF} />
            </View>
            <View style={[styles.rowContainerLeft, {alignItems: 'flex-end', marginTop: 10}]} >
              <HorizontalDataValue label="Power Draw" value="262 mW" color="#FFFFFF" />
              <HorizontalDataValue label="Solar Panel Voltage" value="8.76 V" color="#FFFFFF" />
            </View>
          </ElevatedView>          
          <ElevatedView elevation={5} style={styles.card} >
            <Text style={styles.cardTitle}>Ambient Temperatures</Text>

            <Text style={styles.cardSubtitle}>LEDs</Text>
            <View style={styles.rowContainer} >
              <TempColorText label="1" temp={-39.23} />
              <TempColorText label="2" temp={2.03} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="3" temp={80.13} />
              <TempColorText label="4" temp={30.10} />
            </View>

            <Text style={styles.cardSubtitle}>Batteries</Text>
            <View style={styles.rowContainer} >
              <TempColorText label="L1" temp={-10.65} />
              <TempColorText label="L2" temp={48.22} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="LF1" temp={20.92} />
              <TempColorText label="LF3" temp={60.5} />
            </View>

            <Text style={styles.cardSubtitle}>Panels</Text>
            <View style={styles.rowContainer} >
              <TempColorText label="+X" temp={-10.65} />
              <TempColorText label="-X" temp={48.22} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="+Y" temp={20.92} />
              <TempColorText label="-Y" temp={60.5} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="+Z" temp={20.92} />
              <TempColorText label="-Z" temp={60.5} />
            </View>
            <Text style={styles.cardSubtitle}>Misc.</Text>
            <View style={styles.rowContainer} >
              <TempColorText label="Radio" temp={-10.65} />
              <TempColorText label="IMU" temp={48.22} />
            </View>
          </ElevatedView>
          <ElevatedView elevation={5} style={styles.card} >
            <Text style={styles.cardTitle}>Object Temperatures</Text>            
            <View style={styles.rowContainer} >
              <TempColorText label="+X" temp={-10.65} />
              <TempColorText label="-X" temp={48.22} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="+Y" temp={20.92} />
              <TempColorText label="-Y" temp={60.5} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="+Z" temp={20.92} />
              <TempColorText label="-Z" temp={60.5} />
            </View>
          </ElevatedView>
          <ElevatedView elevation={5} style={styles.card} >
            <Text style={styles.cardTitle}>Photodiodes</Text>            
            <View style={styles.rowContainer} >
              <VerticalDataValue label="+X" value={"0"} color="#FFFFFF" />
              <VerticalDataValue label="-X" value={"1"} color="#FFFFFF" />
            </View>
            <View style={styles.rowContainer} >
              <VerticalDataValue label="+Y" value={"0"} color="#FFFFFF" />
              <VerticalDataValue label="-Y" value={"2"} color="#FFFFFF" />
            </View>
            <View style={styles.rowContainer} >
              <VerticalDataValue label="+Z" value={"0"} color="#FFFFFF" />
              <VerticalDataValue label="-Z" value={"3"} color="#FFFFFF" />
            </View>
          </ElevatedView>
          <View style={styles.rowContainer} >
            <ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >              
                <Text style={styles.cardTitle}>Acc</Text>
                <HorizontalDataValue label="X" value="1.02g" color="#FFFFFF" />
                <HorizontalDataValue label="Y" value="0.00g" color="#FFFFFF" />
                <HorizontalDataValue label="Z" value="0.01g" color="#FFFFFF" />              
            </ElevatedView>
            <ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >
              <Text style={styles.cardTitle}>Gyro</Text>
              <HorizontalDataValue label="X" value="0.08 d/s" color="#FFFFFF" />
              <HorizontalDataValue label="Y" value="0.12 d/s" color="#FFFFFF" />
              <HorizontalDataValue label="Z" value="3.2 d/s" color="#FFFFFF" />
            </ElevatedView>
            <ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >
              <Text style={styles.cardTitle}>Mag</Text>
              <HorizontalDataValue label="X" value="10 mG" color="#FFFFFF" />
              <HorizontalDataValue label="Y" value="12 mG" color="#FFFFFF" />
              <HorizontalDataValue label="Z" value="0 mG" color="#FFFFFF" />
            </ElevatedView>
          </View>
      </View>
    </ScrollView>
  );

  HistoricalView = () => (
    <View>
      <ScrollView>
        <View style={styles.dataContainer}>
          <View style={styles.innerContainer} pointerEvents="none">
            <VictoryChart width={350} theme={VictoryTheme.material}>
              <VictoryBar data={data} x="quarter" y="earnings" />
            </VictoryChart>
            <VictoryChart width={350} theme={VictoryTheme.material}>
              <VictoryLine data={data} x="quarter" y="earnings" />
            </VictoryChart>
            <VictoryChart width={350} theme={VictoryTheme.material}>
              <VictoryScatter
                style={{ data: { fill: "#c43a31" } }}
                size={7}
                data={[
                  { x: 1, y: 2.0 },
                  { x: 2.5, y: 2.8 },
                  { x: 3.1, y: 5.5 },
                  { x: 3.9, y: 6.3 },
                  { x: 5.0, y: 7 }
                ]}
              />
            </VictoryChart>
            <VictoryChart width={350} theme={VictoryTheme.material}>
              <VictoryStack>
                <VictoryArea
                  data={[{x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 5}]}
                />
                <VictoryArea
                  data={[{x: "a", y: 1}, {x: "b", y: 4}, {x: "c", y: 5}]}
                />
                <VictoryArea
                  data={[{x: "a", y: 3}, {x: "b", y: 2}, {x: "c", y: 6}]}
                />
              </VictoryStack>
            </VictoryChart>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  _handleIndexChange = index =>
  this.setState({
    index,
  });

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

  render() {    
    return(
      <TabView
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}