import React, {Component} from 'react';
import { Dimensions, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea, VictoryAxis } from "victory-native";
import DateTimePicker from 'react-native-modal-datetime-picker';
import CustomMultiPicker from "react-native-multiple-select-list";

import {getSignalsLatest, getSignalsInPeriod} from '../api-library-js/EQUiSatAPI.js';

const styles = StyleSheet.create({
	dataContainer: {
	    flex: 1,
	    justifyContent: 'center',
	    backgroundColor: '#131a20',
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

class HistoricalDataFragment extends Component {

	state = {    
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

	
	render() {
		return (
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
	}
}

module.exports= HistoricalDataFragment