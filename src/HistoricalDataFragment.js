import React, {Component} from 'react';
import { Alert, Dimensions, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea, VictoryAxis } from "victory-native";
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Button } from 'react-native-material-ui';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import * as math from 'mathjs';

import {getSignalsLatest, getSignalsInPeriod} from '../api-library-js/EQUiSatAPI.js';
import {signalToName} from '../api-library-js/HumanReadables.js';

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
  	multiSelectContainer: {
	    backgroundColor: '#19222a',
  	},
  	multiSelectSearchIcon: {
	    backgroundColor: '#FFFFFF',
  	},
});

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

const tickValues = [
	[0.25, 0.5, 0.75, 1],
	[0.25, 0.5, 0.75, 1],
	[0.125, 0.375, 0.625, 0.875],
	[0.125, 0.375, 0.625, 0.875]
]

const avcSignals = ["L1_REF","L2_REF", "LREF_AVG","L1_SNS","L2_SNS","PANELREF","L_REF","LF1REF","LF2REF","LF3REF","LF4REF","LFREF_AVG","LFB1SNS","LFB1OSNS","LFB2SNS","LFB2OSNS","LFBSNS_AVG","LED1SNS","LED2SNS","LED3SNS","LED4SNS","LEDSNS_AVG"];
const tempSignals = ["RAD_TEMP","IMU_TEMP","IR_FLASH_AMB","IR_SIDE1_AMB","IR_SIDE2_AMB","IR_RBF_AMB","IR_ACCESS_AMB","IR_TOP1_AMB","IR_AMB_AVG","IR_FLASH_OBJ","IR_SIDE1_OBJ","IR_SIDE2_OBJ","IR_RBF_OBJ","IR_ACCESS_OBJ","IR_TOP1_OBJ","LED1TEMP","LED2TEMP","LED3TEMP","LED4TEMP","LEDTEMP_AVG","L1_TEMP","L2_TEMP","LF1_TEMP","LF3_TEMP","LTEMP_AVG"];
const attitudeSignals = ["PD_TOP1","PD_SIDE1","PD_SIDE2","PD_FLASH","PD_ACCESS ","PD_RBF"];

const xOffsets = [50, 350, 0, 400];
const tickPadding = [-5, -15, -15, -5];
const anchors = ["end", "start", "start", "end"];
const colors = ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 206, 86)", "rgb(75, 192, 192)"];

const maxItems = 4;

const unitMappings = {
	"L1_REF": "V",
	"L2_REF": "V",
	"LREF_AVG": "V",
	"L1_SNS": "A",
	"L2_SNS": "A",
	"PANELREF": "V",
	"L_REF": "V",
	"LF1REF": "V",
	"LF2REF": "V",
	"LF3REF": "V",
	"LF4REF": "V",
	"LFREF_AVG": "V",
	"LFB1SNS": "A",
	"LFB1OSNS": "A",
	"LFB2SNS": "A",
	"LFB2OSNS": "A",
	"LFBSNS_AVG": "A",
	"LED1SNS": "A",
	"LED2SNS": "A",
	"LED3SNS": "A",
	"LED4SNS": "A",
	"LEDSNS_AVG": "A",
	"RAD_TEMP": "C",
	"IMU_TEMP": "C",
	"IR_FLASH_AMB": "C",
	"IR_SIDE1_AMB": "C",
	"IR_SIDE2_AMB": "C",
	"IR_RBF_AMB": "C",
	"IR_ACCESS_AMB": "C",
	"IR_TOP1_AMB": "C",
	"IR_AMB_AVG": "C",
	"IR_FLASH_OBJ": "C",
	"IR_SIDE1_OBJ": "C",
	"IR_SIDE2_OBJ": "C",
	"IR_RBF_OBJ": "C",
	"IR_ACCESS_OBJ": "C",
	"IR_TOP1_OBJ": "C",
	"LED1TEMP": "C",
	"LED2TEMP": "C",
	"LED3TEMP": "C",
	"LED4TEMP": "C",
	"LEDTEMP_AVG": "C",
	"L1_TEMP": "C",
	"L2_TEMP": "C",
	"LF1_TEMP": "C",
	"LF3_TEMP": "C",
	"LTEMP_AVG": "C",
	"PD_TOP1": "b",
	"PD_SIDE1": "b",
	"PD_SIDE2": "b",
	"PD_FLASH": "b",
	"PD_ACCESS ": "b",
	"PD_RBF": "b"
}

class HistoricalDataFragment extends Component {

	state = {
	graphData1: [],
    graphData2: [],
    graphData3: [],
    graphData4: [],
    graphCodes: {"0": [], "1": [], "2": [], "3": []},
    startDateTime: new Date(new Date().getTime() - (60*60*24*7*1000)),
    endDateTime: new Date(),
    startDateTimePickerVisible: false,
    endDateTimePickerVisible: false,
    signalItems: [],
    selectedItems: [],
    confirmText: "",
	}

  onSelectedItemsChange = (selectedItems) => {
    if ( selectedItems.length > maxItems ) {
    	Alert.alert(
			'Too Many Signals',
			'Please select no more than 4 signals.',
			[
    			{text: 'OK'},
  			],
			{ cancelable: false }
		)
      return;
    }
    this.setState({confirmText:` - ${selectedItems.length}/${maxItems}`});
    this.setState({ selectedItems });
    this.setGraphData(selectedItems, this);
  }

  showStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: true });

  showEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: true });

  hideStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: false });

  hideEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: false });

  handleStartDatePicked = (date) => {
  	if (date.getTime() > this.state.endDateTime.getTime()) {
  		Alert.alert(
			'Invalid Start Time',
			'The start time must be before the end time.',
			[
    			{text: 'OK'},
  			],
			{ cancelable: false }
		)
  	} else {
  		this.setState({startDateTime: date})
    	this.setGraphData(this.state.selectedItems, this);
  	}
    this.hideStartDateTimePicker();
  };

  handleEndDatePicked = (date) => {
  	if (date.getTime() < this.state.startDateTime.getTime()) {
  		Alert.alert(
			'Invalid End Time',
			'The end time must be after the start time.',
			[
    			{text: 'OK'},
  			],
			{ cancelable: false }
		)
  	} else {
    	this.setState({endDateTime: date})
	    this.setGraphData(this.state.selectedItems, this);
	}
    this.hideEndDateTimePicker();
  };

  componentDidMount() {
  	this.makeSignalItems();
  }

  makeSignalChildrenArr(signalList) {
  	var childrenArr = [];
  	for (var i = 0; i < signalList.length; i++) {
  		childrenArr.push({name: signalToName(signalList[i]), id: signalList[i]});
  	}
  	return childrenArr;
  }

  makeSignalItems() {
  	var items = [];
  	var avc = {name: "Analog Voltage/Current", id: "0", children: this.makeSignalChildrenArr(avcSignals)};
  	var temps = {name: "Temperatures", id: "1", children: this.makeSignalChildrenArr(tempSignals)};
  	var attitude = {name: "Attitude Determination", id: "2", children: this.makeSignalChildrenArr(attitudeSignals)};
  	items.push(avc, temps, attitude);
  	this.setState({ signalItems: items });
  }

  _formatTick = (t, i) => {
		tick_unit = math.unit(t, unitMappings[this.state.selectedItems[i]]);
		tick_formatted = tick_unit.format({notation: 'fixed', precision: 1});
		return tick_formatted;
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

  _getSignalCodes = (code) => {
    switch (code) {
      case "LREF_AVG": return ["L1_REF", "L2_REF"];
      case "LFREF_AVG": return ["LF1REF", "LF2REF", "LF3REF", "LF4REF"];
      case "LFBSNS_AVG": return ["LFB1SNS", "LFB2SNS", "LFB1OSNS", "LFB2OSNS"];
      case "LEDSNS_AVG": return ["LED1SNS", "LED2SNS", "LED3SNS", "LED4SNS"];
      case "LEDTEMP_AVG": return ["LED1TEMP", "LED2TEMP", "LED3TEMP", "LED4TEMP"];
      case "LTEMP_AVG": return ["L1_TEMP", "L2_TEMP", "LF1_TEMP", "LF3_TEMP"];
      case "IR_AMB_AVG": return ["IR_FLASH_AMB", "IR_SIDE1_AMB", "IR_SIDE2_AMB", "IR_RBF_AMB", "IR_ACCESS_AMB", "IR_TOP1_AMB"];
      default: return [code];
    }
  }

  setGraphData = (res, _this) => {
    if (res.length == 0) {
      _this.setState(
        {
          graphData1: [],
          graphData2: [],
          graphData3: [],
          graphData4: []
        }
      )
    } else if (res.length == 1) {
			_this.setState(
				{
					graphData2: [],
          graphData3: [],
          graphData4: []
				}
			)
		} else if (res.length == 2) {
			_this.setState(
				{
          graphData3: [],
          graphData4: []
				}
			)
		} else if (res.length == 3) {
			_this.setState(
				{
          graphData4: []
				}
			)
		}
    for (let k=0; k<res.length; k++) {
        let codes = _this._getSignalCodes(res[k]);
        let graphCodes = _this.state.graphCodes;
        if (codes != graphCodes[k]) {
          getSignalsInPeriod(codes, _this.state.startDateTime.getTime(), _this.state.endDateTime.getTime())
            .then(function(result) {
             	 if (codes[0] in result.data && result.data[codes[0]]['timestamps'].length > 0) {
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
	              k == 0 ? _this.setState(
	              { graphData1: signal_data })
	                : k == 1
	                  ? _this.setState(
	                    { graphData2: signal_data })
	                  : k == 2
	                    ? _this.setState(
	                      { graphData3: signal_data })
	                    : _this.setState({ graphData4: signal_data })
	            }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        graphCodes[k] = codes
        _this.setState({ graphCodes: graphCodes[k] })
    }
  }


	render() {
		return (
			<View style={styles.dataContainer}>
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
	      	<View pointerEvents="none">
	            <VictoryChart
	              theme={VictoryTheme.material}
	              domain={{ y: [0, 1] }}
	              scale={{ x: "time" }}
								width={400}
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
	                  tickValues={tickValues[i]}
	                  // Re-scale ticks by multiplying by correct maxima
	                  tickFormat={(t) => {
	                    const graphMax = this.getFullData().map(
	                    	(dataset) => Math.max(...dataset.map((d) => d.y))
	                    );
	                    const graphMin = this.getFullData().map(
	                    	(dataset) => Math.min(...dataset.map((d) => d.y))
	                    );

	                    return this._formatTick((t * (graphMax[i] - graphMin[i])) + graphMin[i], i).replace('degC', 'C')
										}}
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
	                    return graphMax[i] - graphMin[i] == 0
	                      ? datum.y
	                      : (datum.y - graphMin[i]) / (graphMax[i] - graphMin[i])}
	                    }
	                />
	              ))}
	            </VictoryChart>
	        </View>

	            <View style={[styles.rowContainer, {paddingTop: 5}]}>
	          		<Button raised accent text={this.state.startDateTime.toLocaleString()} onPress={this.showStartDateTimePicker} />
		          	<Button raised accent text={this.state.endDateTime.toLocaleString()} onPress={this.showEndDateTimePicker} />
	          	</View>
							<View style={[styles.rowContainer, {paddingTop: 5}]}>
								{this.state.selectedItems.map((s, i) =>
									i < 2
										? <Text style={{color: colors[i]}}>{signalToName(s)}</Text>
										: null
								)}
							</View>
							<View style={[styles.rowContainer, {paddingTop: 5}]}>
								{this.state.selectedItems.map((s, i) =>
									i > 1
										? <Text style={{color: colors[i]}}>{signalToName(s)}</Text>
										: null
								)}
							</View>
          	 <SectionedMultiSelect
		          items={this.state.signalItems}
		          uniqueKey='id'
		          subKey='children'
		          selectText='Select Signals...'
		          searchPlaceholderText='Search Signals...'
		          showDropDowns={true}
		          readOnlyHeadings={true}
		          expandDropDowns={true}
		          showCancelButton={true}
		          confirmText={`Done${this.state.confirmText}`}
		          onSelectedItemsChange={this.onSelectedItemsChange}
		          selectedItems={this.state.selectedItems}
		          noResultsComponent={<Text style={{color: "#e5e5e5"}}>Sorry, no results</Text>}
		          searchIconComponent={<Icon name="magnify" size={18} style={{ marginHorizontal: 15, color: "#e5e5e5" }}/>}
		          selectToggleIconComponent={<Icon name="chevron-down" size={22} style={{ color: "#e5e5e5", backgroundColor: "rgba(0,0,0,0)"}}/>}
		          dropDownToggleIconUpComponent={<Icon name="chevron-up" size={22} style={{ color: "#e5e5e5", backgroundColor: "rgba(0,0,0,0)"}}/>}
		          dropDownToggleIconDownComponent={<Icon name="chevron-down" size={22} style={{ color: "#e5e5e5", backgroundColor: "rgba(0,0,0,0)"}}/>}
		          styles={{container: styles.multiSelectContainer, listContainer: styles.multiSelectContainer, item: styles.multiSelectContainer, subItem: styles.multiSelectContainer, searchBar: styles.multiSelectContainer, searchTextInput: {color: "#e5e5e5"}, selectedItem: {backgroundColor: "#6aa2c8"}}}
		          colors={{primary: "#6aa2c8", text: "#e5e5e5", subText: "#e5e5e5", chipColor: "#6aa2c8", selectToggleTextColor: "#e5e5e5", itemBackground: "#19222a", success: "#e5e5e5"}}
		          onConfirm={ () => this.setGraphData(this.state.selectedItems, this) }
		        />
	      </ScrollView>
	    </View>
		);
	}
}

module.exports= HistoricalDataFragment