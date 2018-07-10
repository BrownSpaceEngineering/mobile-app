import React, {Component} from 'react';
import { Dimensions, StyleSheet, View, ScrollView, Text } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea } from "victory-native";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import ElevatedView from 'react-native-elevated-view';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import timeago from 'timeago.js';

import BatteryCircle from './BatteryCircle';
import TempColorText from './TempColorText';
import HorizontalDataValue from './HorizontalDataValue';
import VerticalDataValue from './VerticalDataValue';

const ta = timeago();

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

import {getSignalsLatestSingle, getPreambleData, getSignalsInPeriod} from '../api-library-js/EQUiSatAPI.js';

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

const curDataSignals = ["L1_REF","L2_REF","LF1REF","LF2REF","LF3REF","LF4REF","L1_ST","L2_ST","L1_CHGN","L2_CHGN","LF_B1_CHGN","LF_B2_CHGN","L1_SNS","L2_SNS","PANELREF","LED1TEMP","LED2TEMP","LED3TEMP","LED4TEMP","L1_TEMP","L2_TEMP","LF1_TEMP","LF3_TEMP","IR_FLASH_AMB","IR_SIDE1_AMB","IR_SIDE2_AMB","IR_RBF_AMB","IR_ACCESS_AMB","IR_TOP1_AMB","RAD_TEMP","IMU_TEMP","IR_FLASH_OBJ","IR_SIDE1_OBJ","IR_SIDE2_OBJ","IR_RBF_OBJ","IR_ACCESS_OBJ","IR_TOP1_OBJ","PD_TOP1","PD_SIDE1","PD_SIDE2","PD_FLASH","PD_ACCESS","PD_TOP2","accelerometer1","gyroscope","magnetometer1,"];

export default class DataFragment extends React.Component {

  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Latest' },
      { key: 'second', title: 'Historical' },
    ],
    powerDraw: 1,
    latestData: null,
  }

  componentDidMount() {
    getSignalsInPeriod(["LF1REF", "LED3SNS"], 1529996366626, new Date().getTime())
       .then(function(result) {
          console.log("HERE1");
          console.log(result);          
          console.log("DATAAAAAAAAAAAa");
          console.log(result.data);
        })
        .catch(function (error) {
          console.log("ERRHER");
          console.log(error);
      });

    var _this = this;
    getSignalsLatestSingle(curDataSignals)
       .then(function(result) {
          var latestData = result.data;
          latestData.powerDraw = _this.calculatePowerDraw(latestData);
          _this.setState({ latestData });
        })
        .catch(function (error) {
          console.log(error);
      });
    getPreambleData(null, 1)
       .then(function(result) {
          if (result.data.length > 0) {
            var latestPreamble = result.data[0];
            _this.setState({ latestPreamble });
          }
        })
        .catch(function (error) {
          console.log(error);
      });
  }

  calculatePowerDraw(latestData) {
    var powerDraw = 0;
    if (latestData.L1_ST.value && latestData.L1_SNS.value < 0) {
      powerDraw += (latestData.L1_SNS.value * -1 * latestData.L1_REF.value / 1000);
    }
    if (latestData.L2_ST.value && latestData.L2_SNS.value < 0) {
      powerDraw += (latestData.L2_SNS.value * -1 * latestData.L2_REF.value / 1000);
    }
    return powerDraw.toFixed(0);
  }

  LatestView = () => (
    <ScrollView style={{backgroundColor: "#131a20"}}>
      <View style={styles.dataContainer} >
          <View style={styles.rowContainer} >
            <ElevatedView elevation={5} style={styles.card} >
              <Text style={styles.cardTitle}>Last Transmission</Text>
              <View style={styles.rowContainerLeft} >
                <Icon name="clock" size={20} style={styles.icon} />
                <Text style={styles.cardText}>{ta.format(new Date(this.state.latestPreamble.created))}</Text>
              </View>
              <View style={styles.rowContainerLeft} >
                <Icon name="radio-tower" size={20} style={styles.icon} />
                <Text style={styles.cardText}>{this.state.latestPreamble.station_names[0]}</Text>
              </View>
              <View style={styles.rowContainerLeft} >
                <Text style={styles.cardText}>Current State:  </Text>            
                <Text style={styles.cardText}>{this.state.latestPreamble.preamble.satellite_state}</Text>
              </View>
            </ElevatedView>
            <ElevatedView elevation={5} style={styles.card} >
                                      
            </ElevatedView>
          </View>
          <ElevatedView elevation={5} style={styles.card} >
            <Text style={styles.cardTitle}>Battery Info</Text>
            <Text style={styles.cardSubtitle}>Li-Ion</Text>
            <View style={styles.rowContainer} >
              <BatteryCircle isLion={true} charging={!this.state.latestData.L1_CHGN.value} discharging={this.state.latestData.L1_ST.value} number={1} mV={this.state.latestData.L1_REF.value} />
              <BatteryCircle isLion={true} charging={!this.state.latestData.L2_CHGN.value} discharging={this.state.latestData.L2_ST.value} number={2} mV={this.state.latestData.L2_REF.value} />
            </View>
            <Text style={styles.cardSubtitle}>LiFePO4</Text>
            <View style={styles.rowContainer} >
              <BatteryCircle isLion={false} charging={!this.state.latestData.LF_B1_CHGN.value} number={1} mV={this.state.latestData.LF1REF.value} />
              <BatteryCircle isLion={false} charging={!this.state.latestData.LF_B1_CHGN.value} number={2} mV={this.state.latestData.LF2REF.value} />
              <BatteryCircle isLion={false} charging={!this.state.latestData.LF_B2_CHGN.value} number={3} mV={this.state.latestData.LF3REF.value} />
              <BatteryCircle isLion={false} charging={!this.state.latestData.LF_B2_CHGN.value} number={4} mV={this.state.latestData.LF4REF.value} />
            </View>
            <View style={[styles.rowContainerLeft, {alignItems: 'flex-end', marginTop: 10}]} >
              <HorizontalDataValue label="Power Draw" value={this.state.latestData.powerDraw + " mW"} color="#FFFFFF" />
              <HorizontalDataValue label="Solar Panel Voltage" value={(this.state.latestData.PANELREF.value / 1000) + " V"} color="#FFFFFF" />
            </View>
          </ElevatedView>          
          <ElevatedView elevation={5} style={styles.card} >
            <Text style={styles.cardTitle}>Ambient Temperatures</Text>

            <Text style={styles.cardSubtitle}>LEDs</Text>
            <View style={styles.rowContainer} >
              <TempColorText label="1" temp={this.state.latestData.LED1TEMP.value} />
              <TempColorText label="2" temp={this.state.latestData.LED2TEMP.value} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="3" temp={this.state.latestData.LED3TEMP.value} />
              <TempColorText label="4" temp={this.state.latestData.LED4TEMP.value} />
            </View>

            <Text style={styles.cardSubtitle}>Batteries</Text>
            <View style={styles.rowContainer} >
              <TempColorText label="L1" temp={this.state.latestData.L1_TEMP.value} />
              <TempColorText label="L2" temp={this.state.latestData.L2_TEMP.value} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="LF1" temp={this.state.latestData.LF1_TEMP.value} />
              <TempColorText label="LF3" temp={this.state.latestData.LF3_TEMP.value} />
            </View>

            <Text style={styles.cardSubtitle}>Panels</Text>
            <View style={styles.rowContainer} >
              <TempColorText label="+X" temp={this.state.latestData.IR_RBF_AMB.value} />
              <TempColorText label="-X" temp={this.state.latestData.IR_SIDE1_AMB.value} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="+Y" temp={this.state.latestData.IR_FLASH_AMB.value} />
              <TempColorText label="-Y" temp={this.state.latestData.IR_SIDE1_AMB.value} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="+Z" temp={this.state.latestData.IR_TOP1_AMB.value} />
              <TempColorText label="-Z" temp={this.state.latestData.IR_ACCESS_AMB.value} />
            </View>
            <Text style={styles.cardSubtitle}>Misc.</Text>
            <View style={styles.rowContainer} >
              <TempColorText label="Radio" temp={this.state.latestData.RAD_TEMP.value} />
              <TempColorText label="IMU" temp={this.state.latestData.IMU_TEMP.value} />
            </View>
          </ElevatedView>
          <ElevatedView elevation={5} style={styles.card} >
            <Text style={styles.cardTitle}>Object Temperatures</Text>            
            <View style={styles.rowContainer} >
              <TempColorText label="+X" temp={this.state.latestData.IR_RBF_OBJ.value} />
              <TempColorText label="-X" temp={this.state.latestData.IR_SIDE1_OBJ.value} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="+Y" temp={this.state.latestData.IR_FLASH_OBJ.value} />
              <TempColorText label="-Y" temp={this.state.latestData.IR_SIDE2_OBJ.value} />
            </View>
            <View style={styles.rowContainer} >
              <TempColorText label="+Z" temp={this.state.latestData.IR_TOP1_OBJ.value} />
              <TempColorText label="-Z" temp={this.state.latestData.IR_ACCESS_OBJ.value} />
            </View>
          </ElevatedView>
          <ElevatedView elevation={5} style={styles.card} >
            <Text style={styles.cardTitle}>Photodiodes</Text>            
            <View style={styles.rowContainer} >
              <VerticalDataValue label="+X" value={this.state.latestData.PD_TOP2.value} color="#FFFFFF" />
              <VerticalDataValue label="-X" value={this.state.latestData.PD_SIDE1.value} color="#FFFFFF" />
            </View>
            <View style={styles.rowContainer} >
              <VerticalDataValue label="+Y" value={this.state.latestData.PD_FLASH.value} color="#FFFFFF" />
              <VerticalDataValue label="-Y" value={this.state.latestData.PD_SIDE2.value} color="#FFFFFF" />
            </View>
            <View style={styles.rowContainer} >
              <VerticalDataValue label="+Z" value={this.state.latestData.PD_TOP1.value} color="#FFFFFF" />
              <VerticalDataValue label="-Z" value={this.state.latestData.PD_ACCESS.value} color="#FFFFFF" />
            </View>
          </ElevatedView>
          <View style={styles.rowContainer} >
            <ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >              
                <Text style={styles.cardTitle}>Acc</Text>
                <HorizontalDataValue label="X" value={this.state.latestData.accelerometer1.value.x + " g"} color="#FFFFFF" />
                <HorizontalDataValue label="Y" value={this.state.latestData.accelerometer1.value.y + " g"} color="#FFFFFF" />
                <HorizontalDataValue label="Z" value={this.state.latestData.accelerometer1.value.z + " g"} color="#FFFFFF" />              
            </ElevatedView>
            <ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >
              <Text style={styles.cardTitle}>Gyro</Text>
              <HorizontalDataValue label="X" value={this.state.latestData.gyroscope.value.x + " d/s"} color="#FFFFFF" />
              <HorizontalDataValue label="Y" value={this.state.latestData.gyroscope.value.y + " d/s"} color="#FFFFFF" />
              <HorizontalDataValue label="Z" value={this.state.latestData.gyroscope.value.z + " d/s"} color="#FFFFFF" />
            </ElevatedView>
            <ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >
              <Text style={styles.cardTitle}>Mag</Text>
              <HorizontalDataValue label="X" value={this.state.latestData.magnetometer1.value.x + " mG"} color="#FFFFFF" />
              <HorizontalDataValue label="Y" value={this.state.latestData.magnetometer1.value.y + " mG"} color="#FFFFFF" />
              <HorizontalDataValue label="Z" value={this.state.latestData.magnetometer1.value.z + " mG"} color="#FFFFFF" />
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
    if (!this.state.latestData || !this.state.latestPreamble) {
      return <Expo.AppLoading/>
    } else {
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
}