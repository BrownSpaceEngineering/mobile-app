import React, {Component} from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea } from "victory-native";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const styles = StyleSheet.create({
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#131a20',
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
    backgroundColor: '#6aa2c8',
  },
  label: {
    color: '#fff',
    fontWeight: '400',
  },   
});

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];


const CurrentView = () => (
  <View style={[styles.container, { backgroundColor: '#673ab7' }]} />
);

const HistoricalView = () => (  
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

export default class DataFragment extends React.Component {

  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Current' },
      { key: 'second', title: 'Historical' },
    ],
  }

  _handleIndexChange = index =>
  this.setState({
    index,
  });

  _renderScene = SceneMap({
    first: CurrentView,
    second: HistoricalView,
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