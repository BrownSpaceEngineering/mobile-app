import React, {Component} from 'react';
import { Dimensions, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea, VictoryAxis } from "victory-native";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import ElevatedView from 'react-native-elevated-view';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CustomMultiPicker from "react-native-multiple-select-list";



import BatteryCircle from './BatteryCircle';
import TempColorText from './TempColorText';
import HorizontalDataValue from './HorizontalDataValue';
import VerticalDataValue from './VerticalDataValue';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

import {getSignalsLatestSingle, getSignalsLatest, getSignalsInPeriod} from '../api-library-js/EQUiSatAPI.js';

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
  innerContainer: {
    paddingLeft: 15,
    flex: 1
  }
});

/*const data = [
  [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }],
  [{ x: 1.5, y: 400 }, { x: 3, y: 350 }, { x: 3.2, y: 300 }, { x: 4, y: 250 }],
  [{ x: 1, y: 75 }, { x: 2, y: 85 }, { x: 3, y: 95 }, { x: 4, y: 100 }],
  [{ x: 1, y: 10000 }, { x: 2, y: 230 }, { x:3, y: 5000 }, { x: 4, y: 9000 }]
];*/

let signals = ["LF1REF", "LED3SNS", "IR_FLASH_AMB", "L1_TEMP"];

const monthMap = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const signalOptionList = {
  "L_REF":"LiOn voltage",
  "L_SNS":"LiOn current",
  "L_TEMP":"LiOn temperature",
  "PANELREF":"Solar panel voltage",
  "LFREF":"LiFePo voltage",
  "LFBSNS":"LiFePo current",
  "LF_TEMP":"LiFePo temperature",
  "RAD_TEMP":"Radio temperature",
  "IMU_TEMP":"IMU temperature",
  "IR":"IR sensors ",
  "LEDSNS":"LED current",
  "LEDTEMP":"LED temperature",
}


const xOffsets = [50, 280, 0, 330];
const tickPadding = [10, -15, -15, 15];
const anchors = ["start", "start", "start", "start"];
const colors = ["yellow", "red", "blue", "green"];

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
    graphData1: [],
    graphData2: [],
    graphData3: [],
    graphData4: [],
    graphMaxima: [],
    graphMinima: [],
    startDateTime: null,
    endDateTime: null,
    startDateTimePickerVisible: false,
    endDateTimePickerVisible: false
  }

  showStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: true });

  showEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: true });

  hideStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: false });

  hideEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: false });

  handleStartDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.hideStartDateTimePicker();
  };

  handleEndDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.hideEndDateTimePicker();
  };

  _formatTick = (t) => {
    let tickString = t.toString();
    alert(t);
    if (tickString.length > 2) {
      return tickString[2] == "." ? tickString.slice(0, 1) : tickString.slice(0, 2);
    } else {
      return tickString;
    }
  }

  getFullData = () => {
    var data = [];
    const full_data = [
      this.state.graphData1,
      this.state.graphData2,
      this.state.graphData3,
      this.state.graphData4
    ]
    for (let x = 0; x<4; x++) {
      if (full_data[x].length > 0) {
        data.push(full_data[x])
      }
    }
    return data;
  }

  _getSensorCodes = (code) => {
    switch (code) {
      case "L_REF": return ["L1_REF", "L2_REF"];
      case "L_SNS": return ["L1_SNS", "L2_SNS"];
      case "L_TEMP": return ["L1_TEMP", "L2_TEMP"];
      case "PANELREF": return ["PANELREF"];
      case "LFREF": return ["LF1REF", "LF2REF", "LF3REF", "LF4REF"];
      case "LFBSNS": return ["LFB1SNS", "LFB2SNS"];
      case "LF_TEMP": return ["LF1_TEMP"]; //, "LF2_TEMP"]; LF2_TEMP yet to have values, will add back soon
      case "RAD_TEMP": return ["RAD_TEMP"];
      case "IMU_TEMP": return ["IMU_TEMP"];
      case "IR": return ["IR_FLASH_AMB"];
      case "LEDSNS": return ["LED1SNS", "LED2SNS", "LED3SNS", "LED4SNS"];
      case "LEDTEMP": return ["LED1TEMP", "LED2TEMP", "LED3TEMP", "LED4TEMP"];
      default: return;
    }
  }

  _setGraphData = (res) => {
    let data = [];
    for (let k=0; k<res.length; k++) {
      if (k > 3) {
        alert('Please select at most four signals');
        break;
      }
      else {
        let codes = this._getSensorCodes(res[k]);
        getSignalsInPeriod(codes, 1529996366626, new Date().getTime())
          .then(function(result) {
            let timestamps = result.data[codes[0]]['timestamps'];
            let values = [];
            for (let q=0; q<codes.length; q++){
              values.push(result.data[codes[q]]['values']);
            }
            let signal_data = [];
            for (let b=0; b<timestamps.length; b++) {
              let dateTime = new Date(timestamps[b]);
              let avg_values=[];
              for (let a=0; a<codes.length; a++) {
                avg_values.push(values[a][b]);
              }
              let average = codes.length == 0
                ? 0
                : avg_values.reduce(function(a, b) { return a + b; }) / codes.length;
              signal_data.push({x: dateTime, y: average});
            }
            k == 0 ? this.setState({graphData1: signal_data})
              : k == 1
                ? this.setState({ graphData2: signal_data })
                : k == 2
                  ? this.setState({ graphData3: signal_data })
                  : this.setState({ graphData4: signal_data })
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }

  componentDidMount() {
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

          <TouchableOpacity onPress={() => console.log(this.getFullData())}>
            <Text>Select start time</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.showEndDateTimePicker}>
            <Text>Select start time</Text>
          </TouchableOpacity>

          <View style={styles.innerContainer} pointerEvents="none">

            <VictoryChart
              theme={VictoryTheme.material}
              width={330} height={330}
              domain={{ y: [0, 1] }}
              scale={{ x: "time" }}
            >
             <VictoryAxis />
              {this.getFullData().map((d, i) => (
                <VictoryAxis dependentAxis
                  key={i}
                  offsetX={xOffsets[i]}
                  style={{
                    axis: { stroke: colors[i] },
                    ticks: { padding: tickPadding[i] },
                    tickLabels: { fill: colors[i], textAnchor: anchors[i] }
                  }}
                  // Use normalized tickValues (0 - 1)
                  tickValues={[0.25, 0.5, 0.75, 1]}
                  // Re-scale ticks by multiplying by correct maxima
                  tickFormat={(t) => {
                    const graphMax = this.getFullData().map(
                    	(dataset) => Math.max(...dataset.map((d) => d.y))
                    );
                    const graphMin = this.getFullData().map(
                    	(dataset) => Math.min(...dataset.map((d) => d.y))
                    );

                    console.log(this.getFullData());
                    this._formatTick((t * (graphMax[i] - graphMin[i])) + graphMin[i])}
                  }/*this._formatTick(t, this.state.graphMaxima[i])*/
                />
              ))}
              {this.getFullData().map((d, i) => (
                <VictoryLine
                  key={i}
                  data={d}
                  style={{ data: { stroke: colors[i] } }}
                  // normalize data
                  y={(datum) => {//datum.y / this.state.graphMaxima[i] }
                    const graphMax = this.getFullData().map(
                      (dataset) => Math.max(...dataset.map((d) => d.y))
                    );
                    const graphMin = this.getFullData().map(
                      (dataset) => Math.min(...dataset.map((d) => d.y))
                    );
                    graphMax[i] - graphMin[i] == 0
                      ? datum.y
                      : (datum.y - graphMin[i]) / (graphMax[i] - graphMin[i])}
                    }
                />
              ))}
            </VictoryChart>
          </View>
          <CustomMultiPicker
            options={signalOptionList}
            search={true} // should show search bar?
            multiple={true} //
            placeholder={"Search"}
            placeholderTextColor={'#757575'}
            returnValue={"value"} // label or value
            callback={ (res) => this._setGraphData(res) }
            rowBackgroundColor={"#eee"}
            rowHeight={40}
            rowRadius={5}
            iconColor={"#00a2dd"}
            iconSize={30}
            selectedIconName={"ios-checkmark-circle-outline"}
            unselectedIconName={"ios-radio-button-off-outline"}
            scrollViewHeight={600}
            selected={[]} // list of options which are selected by default
          />
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

    <View>
      <DateTimePicker
        isVisible={this.state.startDateTimePickerVisible}
        onConfirm={this.handleStartDatePicked}
        onCancel={this.hideStartDateTimePicker}
        mode={"datetime"}
      />

      <DateTimePicker
        isVisible={this.state.endDateTimePickerVisible}
        onConfirm={this.handleEndDatePicked}
        onCancel={this.hideEndDateTimePicker}
        mode={"datetime"}
      />
    </View>
    if (!this.state.latestData) {
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
