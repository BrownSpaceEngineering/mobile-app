import React, {Component} from 'react';
import { Alert, Dimensions, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea, VictoryAxis } from "victory-native";

const styles = StyleSheet.create({
	dataContainer: {
	    flex: 1,
	    justifyContent: 'center',
	    backgroundColor: '#131a20',
  	},
 });

class LastFlashDataFragment extends Component {

	state = {
	
	}
 
	render() {
		return (
		<View style={styles.dataContainer}>				
		      <ScrollView>
				<Text style={{color: "#e5e5e5"}}>Last Flash Goes Here</Text>
		      </ScrollView>
	    </View>
		);
	}
}

module.exports= LastFlashDataFragment
