import React, {Component} from 'react';
import { Alert, Dimensions, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea, VictoryAxis } from "victory-native";
import { Button } from 'react-native-material-ui';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import * as math from 'mathjs';

import {getFlashBurstData} from '../api-library-js/EQUiSatAPI.js';
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
  	inlineContainer: {
		flexDirection: 'row',
	  	justifyContent: 'flex-start',
  	},
  	multiSelectContainer: {
	    backgroundColor: '#19222a',
  	},
  	multiSelectSearchIcon: {
	    backgroundColor: '#FFFFFF',
  	},
});

const timeStamps = [-20, 0, 20, 40, 60, 80, 100];

const unitMappings = {
	"LF1REF": "mV",
	"LF2REF": "mV",
	"LF3REF": "mV",
	"LF4REF": "mV",
	"LFREF_AVG": "mV",
	"LFB1SNS": "mA",
	"LFB1OSNS": "mA",
	"LFB2SNS": "mA",
	"LFB2OSNS": "mA",
	"LFBSNS_AVG": "mA",
	"LED1SNS": "mA",
	"LED2SNS": "mA",
	"LED3SNS": "mA",
	"LED4SNS": "mA",
	"LEDSNS_AVG": "mA",
	"LED1TEMP": "C",
	"LED2TEMP": "C",
	"LED3TEMP": "C",
	"LED4TEMP": "C",
	"LEDTEMP_AVG": "C",
	"LF1_TEMP": "C",
	"LF3_TEMP": "C",
	"LTEMP_AVG": "C",
}

const tickValues = [
	[0.25, 0.5, 0.75, 1],
	[0.25, 0.5, 0.75, 1],
	[0.125, 0.375, 0.625, 0.875],
	[0.125, 0.375, 0.625, 0.875]
]

const avcSignals = ["LF1REF","LF2REF","LF3REF","LF4REF","LFREF_AVG","LFB1SNS","LFB1OSNS","LFB2SNS","LFB2OSNS","LFBSNS_AVG","LED1SNS","LED2SNS","LED3SNS","LED4SNS","LEDSNS_AVG"];
const tempSignals = ["LED1TEMP","LED2TEMP","LED3TEMP","LED4TEMP","LEDTEMP_AVG","LF1_TEMP","LF3_TEMP","LTEMP_AVG"];

const xOffsets = [50, 350, 0, 400];
const tickPadding = [-5, -15, -15, -5];
const anchors = ["end", "start", "start", "end"];
const colors = ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 206, 86)", "rgb(75, 192, 192)"];

const maxItems = 4;

class LastFlashDataFragment extends Component {

	state = {
		signalItems: [],
    selectedItems: [],
		confirmText: "",
		graphData1: [],
		graphData2: [],
		graphData3: [],
		graphData4: [],
		haveFlashData: false,
	}

	makeSignalChildrenArr(signalList) {
  	var childrenArr = [];
  	for (var i = 0; i < signalList.length; i++) {
  		childrenArr.push({name: signalToName(signalList[i]), id: signalList[i]});
  	}
  	return childrenArr;
  }

	componentDidMount() {
  	this.makeSignalItems();
  	var _this = this;
  	getFlashBurstData(["LED1TEMP"], 1)
		.then(function(result) {
			if (result.data.length > 0) {
				_this.setState({ haveFlashData: true });
			}
		})
		.catch(function (error) {
        	console.log(error);
        });

  }

	makeSignalItems() {
  	var items = [];
  	var avc = {name: "Analog Voltage/Current", id: "0", children: this.makeSignalChildrenArr(avcSignals)};
  	var temps = {name: "Temperatures", id: "1", children: this.makeSignalChildrenArr(tempSignals)};
  	items.push(avc, temps);
  	this.setState({ signalItems: items });
  }

	displayLabel(shouldDisplay, labelNum) {
		if (shouldDisplay) {
			switch(labelNum) {
				case 1:
					return (<View style={styles.inlineContainer}>
					<Icon name="checkbox-blank-circle" size={20} style={{color: colors[0]}}/>
					<Text style={{color: colors[0]}}>{this.state.selectedItems.length > 0 ? this.state.selectedItems[0] : "" }</Text>
				</View>);
					break;
				case 2:
					return (<View style={styles.inlineContainer}>
					<Icon name="checkbox-blank-circle" size={20} style={{color: colors[1]}}/>
					<Text style={{color: colors[1]}}>{this.state.selectedItems.length > 0 ? this.state.selectedItems[1] : "" }</Text>
					</View>);
					break;
				case 3:
					return (<View style={styles.inlineContainer}>
					<Icon name="checkbox-blank-circle" size={20} style={{color: colors[2]}}/>
					<Text style={{color: colors[2]}}>{this.state.selectedItems.length > 0 ? this.state.selectedItems[2] : "" }</Text>
					</View>);
					break;
				case 4:
					return(<View style={styles.inlineContainer}>
					<Icon name="checkbox-blank-circle" size={20} style={{color: colors[3]}}/>
					<Text style={{color: colors[3]}}>{this.state.selectedItems.length > 0 ? this.state.selectedItems[3] : "" }</Text>
					</View>);
					break;
			}
		} else {
			return <View/>
		}
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
  }

	_getSignalCodes = (code) => {
    switch (code) {
      case "LFREF_AVG": return ["LF1REF", "LF2REF", "LF3REF", "LF4REF"];
      case "LFBSNS_AVG": return ["LFB1SNS", "LFB2SNS", "LFB1OSNS", "LFB2OSNS"];
      case "LEDSNS_AVG": return ["LED1SNS", "LED2SNS", "LED3SNS", "LED4SNS"];
      case "LEDTEMP_AVG": return ["LED1TEMP", "LED2TEMP", "LED3TEMP", "LED4TEMP"];
      case "LTEMP_AVG": return ["LF1_TEMP", "LF3_TEMP"];
      default: return [code];
    }
  }

	_formatTick = (t, i) => {
			if (i < this.state.selectedItems.length) {
				tick_unit = math.unit(t, unitMappings[this.state.selectedItems[i]]);
			tick_formatted = tick_unit.format({notation: 'fixed', precision: 1});
			return tick_formatted;
			} else {
				return "";
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

	setGraphData(signals, _this) {
		if (signals.length == 0) {
      _this.setState(
        {
          graphData1: [],
          graphData2: [],
          graphData3: [],
          graphData4: []
        }
      )
    } else if (signals.length == 1) {
			_this.setState(	{
			graphData2: [],
          	graphData3: [],
          	graphData4: []
			})
		} else if (signals.length == 2) {
			_this.setState({
          		graphData3: [],
          		graphData4: []
			})
		} else if (signals.length == 3) {
			_this.setState({ graphData4: []})
		}
		for (let k=0; k<signals.length; k++) {
      let codes = _this._getSignalCodes(signals[k]);
			getFlashBurstData(codes, 1)
			.then(function(result) {				
				const result_data = result.data[1]['payload']['burst'];
				// const result_data = [{"LED3TEMP":-104,"LF1REF":3584,"LED2TEMP":-104,"LED1TEMP":-104,"LFB2OSNS":0,"LF3_TEMP":-104,"LFB2SNS":-750,"LED2SNS":433,"LF2REF":3291,"LED4SNS":467,"LED1SNS":433,"LFB1SNS":-750,"LED3SNS":100,"gyroscope":{"y":-1.82,"x":-1.82,"z":0.14},"LF3REF":2852,"LF4REF":3273,"LF1_TEMP":-104,"LFB1OSNS":0,"LED4TEMP":-104},{"LED3TEMP":-104,"LF1REF":3638,"LED2TEMP":-104,"LED1TEMP":-104,"LFB2OSNS":0,"LF3_TEMP":-104,"LFB2SNS":-750,"LED2SNS":200,"LF2REF":3273,"LED4SNS":367,"LED1SNS":400,"LFB1SNS":-750,"LED3SNS":233,"gyroscope":{"y":-1.82,"x":-1.82,"z":0.14},"LF3REF":2944,"LF4REF":3236,"LF1_TEMP":-104,"LFB1OSNS":0,"LED4TEMP":-104},{"LED3TEMP":-104,"LF1REF":3620,"LED2TEMP":-104,"LED1TEMP":-104,"LFB2OSNS":0,"LF3_TEMP":-104,"LFB2SNS":-750,"LED2SNS":0,"LF2REF":3236,"LED4SNS":867,"LED1SNS":800,"LFB1SNS":-750,"LED3SNS":0,"gyroscope":{"y":-1.82,"x":-1.82,"z":0.14},"LF3REF":2962,"LF4REF":3254,"LF1_TEMP":-104,"LFB1OSNS":0,"LED4TEMP":-104},{"LED3TEMP":-104,"LF1REF":3602,"LED2TEMP":-104,"LED1TEMP":-104,"LFB2OSNS":0,"LF3_TEMP":-104,"LFB2SNS":-450,"LED2SNS":67,"LF2REF":3236,"LED4SNS":333,"LED1SNS":500,"LFB1SNS":-450,"LED3SNS":233,"gyroscope":{"y":-1.82,"x":-1.82,"z":0.14},"LF3REF":2925,"LF4REF":3218,"LF1_TEMP":-104,"LFB1OSNS":0,"LED4TEMP":-103},{"LED3TEMP":-104,"LF1REF":3529,"LED2TEMP":-104,"LED1TEMP":-104,"LFB2OSNS":0,"LF3_TEMP":-104,"LFB2SNS":-750,"LED2SNS":267,"LF2REF":3254,"LED4SNS":300,"LED1SNS":400,"LFB1SNS":-750,"LED3SNS":233,"gyroscope":{"y":-1.82,"x":-1.82,"z":0.14},"LF3REF":2944,"LF4REF":3236,"LF1_TEMP":-104,"LFB1OSNS":0,"LED4TEMP":-104},{"LED3TEMP":-104,"LF1REF":3638,"LED2TEMP":-104,"LED1TEMP":-104,"LFB2OSNS":0,"LF3_TEMP":-104,"LFB2SNS":-750,"LED2SNS":300,"LF2REF":3236,"LED4SNS":433,"LED1SNS":367,"LFB1SNS":-750,"LED3SNS":200,"gyroscope":{"y":-1.82,"x":-1.82,"z":0.14},"LF3REF":2907,"LF4REF":3254,"LF1_TEMP":-104,"LFB1OSNS":0,"LED4TEMP":-104},{"LED3TEMP":-104,"LF1REF":3620,"LED2TEMP":-104,"LED1TEMP":-104,"LFB2OSNS":0,"LF3_TEMP":-104,"LFB2SNS":-750,"LED2SNS":333,"LF2REF":3254,"LED4SNS":400,"LED1SNS":333,"LFB1SNS":-750,"LED3SNS":167,"gyroscope":{"y":-1.82,"x":-1.82,"z":0.14},"LF3REF":2907,"LF4REF":3254,"LF1_TEMP":-104,"LFB1OSNS":0,"LED4TEMP":-104}]
				let signal_data = [];
				for (let q=0; q<timeStamps.length; q++) {
					let avg_values = [];
					for (let b=0; b<codes.length; b++) {
						avg_values.push(result_data[q][codes[b]]);
					}
					let average = codes.length == 0
						? 0
						: avg_values.reduce(function(a, b) { return a + b; }) / codes.length;
					signal_data.push({x: timeStamps[q], y: average});
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
			 })
			.catch(function (error) {
              console.log(error);
            });
		}
	}

	render() {
		if (!this.state.haveFlashData) {
			return (
				<View style={{flex: 1, backgroundColor: '#131a20'}}>
					<Text style={{textAlign: 'center', fontSize: 20, color: "#e5e5e5"}}>Awaiting First Flash</Text>
				</View>
			);
		} else {			
			return (
				<View style={styles.dataContainer}>
		      <ScrollView>
						<SectionedMultiSelect
							items={this.state.signalItems}
							uniqueKey='id'
							subKey='children'
							selectText='Select Signals...'
							searchPlaceholderText='Search Signals...'
							showDropDowns={false}
							readOnlyHeadings={true}
							expandDropDowns={false}
							showCancelButton={true}
							showChips={false}
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

						<View style={styles.rowContainer}>
		    			{this.displayLabel(this.state.selectedItems.length > 0, 1)}
				    	{this.displayLabel(this.state.selectedItems.length > 1, 2)}
				    	{this.displayLabel(this.state.selectedItems.length > 2, 3)}
				    	{this.displayLabel(this.state.selectedItems.length > 3, 4)}
			    	</View>

						<View pointerEvents="none" style={{alignItems: 'center', paddingLeft: 25, paddingRight: 25}}>
								<VictoryChart
										theme={VictoryTheme.material}
										domain={{ y: [0, 1] }}
									scale={{ x: "linear" }}
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
												return this._formatTick((t * (graphMax[i] - graphMin[i])) + graphMin[i], i).replace('degC', 'C');
											}}
										/>
									))}
									{this.getFullData().map((d, i) => (
										<VictoryLine
											key={i}
											data={d}
											style={{ data: { stroke: colors[i] } }}
											interpolation={"basis"}
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
		      </ScrollView>
		    </View>
			);
		}
	}
}

module.exports= LastFlashDataFragment
