import React, {Component} from 'react';
import { RefreshControl, Dimensions, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import timeago from 'timeago.js';
import ElevatedView from 'react-native-elevated-view';

import BatteryCircle from './BatteryCircle';
import TempColorText from './TempColorText';
import HorizontalDataValue from './HorizontalDataValue';
import VerticalDataValue from './VerticalDataValue';
import PhotodiodeValue from './PhotodiodeValue';
import {getSignalsLatestSingle, getPreambleData} from '../api-library-js/EQUiSatAPI.js';

const ta = timeago();

const curDataSignals = ["L1_REF","L2_REF","LF1REF","LF2REF","LF3REF","LF4REF","L1_ST","L2_ST","L1_CHGN","L2_CHGN","LF_B1_CHGN","LF_B2_CHGN","L1_SNS","L2_SNS","PANELREF","LED1TEMP","LED2TEMP","LED3TEMP","LED4TEMP","L1_TEMP","L2_TEMP","LF1_TEMP","LF3_TEMP","IR_FLASH_AMB","IR_SIDE1_AMB","IR_SIDE2_AMB","IR_RBF_AMB","IR_ACCESS_AMB","IR_TOP1_AMB","RAD_TEMP","IMU_TEMP","IR_FLASH_OBJ","IR_SIDE1_OBJ","IR_SIDE2_OBJ","IR_RBF_OBJ","IR_ACCESS_OBJ","IR_TOP1_OBJ","PD_TOP1","PD_SIDE1","PD_SIDE2","PD_FLASH","PD_ACCESS","PD_TOP2","accelerometer1X","accelerometer1Y", "accelerometer1Z","gyroscopeX", "gyroscopeY", "gyroscopeZ","magnetometer1X", "magnetometer1Y", "magnetometer1Z", "boot_count"];

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

class LatestDataFragment extends Component {

	state = {    
		powerDraw: 1,
		latestData: null,
		latestPreamble: null,
		refreshing: false,
	}

	updateData(pullToRefresh) {
		if (pullToRefresh) {
			this.setState({refreshing: true});
		}		
		var _this = this;
		getSignalsLatestSingle(curDataSignals)
		.then(function(result) {			
			var latestData = result.data;			
			latestData.powerDraw = _this.calculatePowerDraw(latestData);
			_this.setState({ latestData });
			if (pullToRefresh) {
				_this.setState({refreshing: false});
			}
		})
		.catch(function (error) {
			console.log(error);
		});
		getPreambleData(null, 1)
		.then(function(result) {			
			var latestPreamble = result.data.length > 0 ? result.data[0] : {};
			_this.setState({ latestPreamble });
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	handleOnRefresh = () => this.updateData(true);

	componentDidMount() {    
		this.updateData(false);
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

	isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
    		return false;
    }	   
	    return true;
	}

	render() {
		if (this.state.latestData == null || this.state.latestPreamble == null) {
      		return <Expo.AppLoading/>
    	} else if (this.isEmpty(this.state.latestPreamble)) {
    		return (
    			<View style={styles.dataContainer} >						
					<ElevatedView elevation={5} style={styles.card} >
						<Text style={styles.cardTitle}>AWAITING FIRST TRANSMISSION</Text>						
					</ElevatedView>							
				</View>
			);
    	} else {
			return (
				<ScrollView 
					style={{backgroundColor: "#131a20"}}
					refreshControl={
			          <RefreshControl
			          	refreshing={this.state.refreshing}
			            onRefresh={this.handleOnRefresh}
			          />
			        }
				>
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
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Boot Count:  </Text>            
									<Text style={styles.cardText}>{this.state.latestData.boot_count.value}</Text>
								</View>
							</ElevatedView>							
						</View>
						<ElevatedView elevation={5} style={styles.card} >
							<Text style={styles.cardTitle}>Battery Info</Text>
							<Text style={styles.cardSubtitle}>Li-Ion</Text>
							<View style={styles.rowContainer} >
								<BatteryCircle isLion={true} charging={this.state.latestData.L1_CHGN.value} discharging={this.state.latestData.L1_ST.value} number={1} mV={this.state.latestData.L1_REF.value} />
								<BatteryCircle isLion={true} charging={this.state.latestData.L2_CHGN.value} discharging={this.state.latestData.L2_ST.value} number={2} mV={this.state.latestData.L2_REF.value} />
							</View>
							<Text style={styles.cardSubtitle}>LiFePO4</Text>
							<View style={styles.rowContainer} >
								<BatteryCircle isLion={false} charging={this.state.latestData.LF_B1_CHGN.value} number={1} mV={this.state.latestData.LF1REF.value} />
								<BatteryCircle isLion={false} charging={this.state.latestData.LF_B1_CHGN.value} number={2} mV={this.state.latestData.LF2REF.value} />
								<BatteryCircle isLion={false} charging={this.state.latestData.LF_B2_CHGN.value} number={3} mV={this.state.latestData.LF3REF.value} />
								<BatteryCircle isLion={false} charging={this.state.latestData.LF_B2_CHGN.value} number={4} mV={this.state.latestData.LF4REF.value} />
							</View>
							<View style={[styles.rowContainer, {alignItems: 'flex-end', marginTop: 10}]} >
								<VerticalDataValue label="Power Draw" value={this.state.latestData.powerDraw + " mW"} color="#FFFFFF" />
								<VerticalDataValue label="Solar Panel Voltage" value={(this.state.latestData.PANELREF.value / 1000) + " V"} color="#FFFFFF" />
							</View>
						</ElevatedView>
						<ElevatedView elevation={5} style={styles.card} >
							<Text style={styles.cardTitle}>Ambient Temperatures</Text>						
							<Text style={styles.cardSubtitle}>LEDs</Text>
							<View style={styles.rowContainer} >
								<TempColorText label="1" temp={this.state.latestData.LED1TEMP ? this.state.latestData.LED1TEMP.value.toString() : "?"} />
								<TempColorText label="2" temp={this.state.latestData.LED2TEMP ? this.state.latestData.LED2TEMP.value.toString() : "?"} />
							</View>
							<View style={styles.rowContainer} >
								<TempColorText label="3" temp={this.state.latestData.LED3TEMP ? this.state.latestData.LED3TEMP.value.toString() : "?"} />
								<TempColorText label="4" temp={this.state.latestData.LED4TEMP ? this.state.latestData.LED4TEMP.value.toString() : "?"} />
							</View>
							<Text style={styles.cardSubtitle}>Batteries</Text>
								<View style={styles.rowContainer} >
									<TempColorText label="L1" temp={this.state.latestData.L1_TEMP ? this.state.latestData.L1_TEMP.value.toString() : "?"} />
									<TempColorText label="L2" temp={this.state.latestData.L2_TEMP ? this.state.latestData.L2_TEMP.value.toString() : "?"} />
								</View>
								<View style={styles.rowContainer} >
									<TempColorText label="LF1" temp={this.state.latestData.LF1_TEMP ? this.state.latestData.LF1_TEMP.value.toString() : "?"} />
									<TempColorText label="LF3" temp={this.state.latestData.LF3_TEMP ? this.state.latestData.LF3_TEMP.value.toString() : "?"} />
								</View>
							<Text style={styles.cardSubtitle}>Panels</Text>
							<View style={styles.rowContainer} >
								<TempColorText label="+X" temp={this.state.latestData.IR_RBF_AMB.value.toString()} />
								<TempColorText label="-X" temp={this.state.latestData.IR_SIDE1_AMB.value.toString()} />
							</View>
							<View style={styles.rowContainer} >
								<TempColorText label="+Y" temp={this.state.latestData.IR_FLASH_AMB.value.toString()} />
								<TempColorText label="-Y" temp={this.state.latestData.IR_SIDE2_AMB.value.toString()} />
							</View>
							<View style={styles.rowContainer} >
								<TempColorText label="+Z" temp={this.state.latestData.IR_TOP1_AMB.value.toString()} />
								<TempColorText label="-Z" temp={this.state.latestData.IR_ACCESS_AMB.value.toString()} />
							</View>
							<Text style={styles.cardSubtitle}>Misc.</Text>
							<View style={styles.rowContainer} >
								<TempColorText label="Radio" temp={this.state.latestData.RAD_TEMP.value.toString()} />
								<TempColorText label="IMU" temp={this.state.latestData.IMU_TEMP.value.toFixed(2).toString()} />
							</View>
						</ElevatedView>
						<ElevatedView elevation={5} style={styles.card} >
							<Text style={styles.cardTitle}>Object Temperatures</Text>
							<View style={styles.rowContainer} >
								<TempColorText label="+X" temp={this.state.latestData.IR_RBF_OBJ.value.toString()} />
								<TempColorText label="-X" temp={this.state.latestData.IR_SIDE1_OBJ.value.toString()} />
							</View>
							<View style={styles.rowContainer} >
								<TempColorText label="+Y" temp={this.state.latestData.IR_FLASH_OBJ.value.toString()} />
								<TempColorText label="-Y" temp={this.state.latestData.IR_SIDE2_OBJ.value.toString()} />
							</View>
							<View style={styles.rowContainer} >
								<TempColorText label="+Z" temp={this.state.latestData.IR_TOP1_OBJ.value.toString()} />
								<TempColorText label="-Z" temp={this.state.latestData.IR_ACCESS_OBJ.value.toString()} />
							</View>
						</ElevatedView>
						<ElevatedView elevation={5} style={styles.card} >
							<Text style={styles.cardTitle}>Photodiodes</Text>
							<View style={styles.rowContainer} >
								<View>
									<PhotodiodeValue label="+X" num={this.state.latestData.PD_TOP2.value} />
									<PhotodiodeValue label="+Y" num={this.state.latestData.PD_FLASH.value} />
									<PhotodiodeValue label="+Z" num={this.state.latestData.PD_TOP1.value} />
								</View>
								<View>
									<PhotodiodeValue label="-X" num={this.state.latestData.PD_SIDE1.value} />
									<PhotodiodeValue label="-Y" num={this.state.latestData.PD_SIDE2.value} />
									<PhotodiodeValue label="-Z" num={this.state.latestData.PD_ACCESS.value} />
								</View>
							</View>
						</ElevatedView>
						<View style={styles.rowContainer} >
							<ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >
								<Text style={styles.cardTitle}>Acc</Text>
								<HorizontalDataValue label="X" value={(this.state.latestData.accelerometer1X ? this.state.latestData.accelerometer1X.value : "?") + " g"} color="#FFFFFF" />
								<HorizontalDataValue label="Y" value={(this.state.latestData.accelerometer1Y ? this.state.latestData.accelerometer1Y.value : "?") + " g"} color="#FFFFFF" />
								<HorizontalDataValue label="Z" value={(this.state.latestData.accelerometer1Z ? this.state.latestData.accelerometer1Z.value : "?") + " g"} color="#FFFFFF" />
							</ElevatedView>
							<ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >
								<Text style={styles.cardTitle}>Gyro</Text>
								<HorizontalDataValue label="X" value={(this.state.latestData.gyroscopeX ? this.state.latestData.gyroscopeX.value : "?") + " d/s"} color="#FFFFFF" />
								<HorizontalDataValue label="Y" value={(this.state.latestData.gyroscopeY ? this.state.latestData.gyroscopeY.value : "?") + " d/s"} color="#FFFFFF" />
								<HorizontalDataValue label="Z" value={(this.state.latestData.gyroscopeZ ? this.state.latestData.gyroscopeZ.value : "?") + " d/s"} color="#FFFFFF" />
							</ElevatedView>
							<ElevatedView elevation={5} style={[styles.card, {alignItems: 'center'}]} >
								<Text style={styles.cardTitle}>Mag</Text>
								<HorizontalDataValue label="X" value={(this.state.latestData.magnetometer1X ? this.state.latestData.magnetometer1X.value : "?") + " mG"} color="#FFFFFF" />
								<HorizontalDataValue label="Y" value={(this.state.latestData.magnetometer1Y ? this.state.latestData.magnetometer1Y.value : "?") + " mG"} color="#FFFFFF" />
								<HorizontalDataValue label="Z" value={(this.state.latestData.magnetometer1Z ? this.state.latestData.magnetometer1Z.value : "?") + " mG"} color="#FFFFFF" />
							</ElevatedView>
						</View>
					</View>
				</ScrollView>
			);
		}
	}
}

module.exports= LatestDataFragment