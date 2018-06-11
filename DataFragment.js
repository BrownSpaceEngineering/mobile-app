import React, {Component} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea } from "victory-native";

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

export default class DataFragment extends React.Component {

  render() {    
      return(
        <ScrollView>
          <View style={styles.modalContainer}>
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
      );
  }
}