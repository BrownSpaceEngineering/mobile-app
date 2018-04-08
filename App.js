import React from 'react';
import { StyleSheet, Text, Button, Modal, View, Image, ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios'
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryStack, VictoryArea } from "victory-native";


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

module.exports = class MyApp extends React.Component {
  state = {
      latitude: 20,
      longitude: 20,
      altitude: 0,
      userLatitude: 10,
      userLongitude: 10,
      modalVisible: false,
    }

  openModal() {
    this.setState({modalVisible: true});
  }

  closeModal() {
    this.setState({modalVisible: false});
  }

  componentDidMount() {
    var _this = this;
    /* TODO:
    Fix the API call*/
    this.serverRequest =
      axios
        .get('http://0.0.0.0/api/get_lonlatalt')
        .then(function(result) {
          _this.setState({
            latitude: result.latitude,
            longitude: result.longitude,
            altitude: result.altitude});
        })
        .catch(function (error) {
          alert(error);
          return undefined; });
    function success(pos) {
        _this.setState({
          userLatitude: pos.coords.latitude,
          userLongitude: pos.coords.longitude});
      };
    navigator.geolocation.getCurrentPosition(success);
  }


  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 50,
            longitudeDelta: 50
          }}
        >
        <MapView.Marker
          coordinate={{
            latitude: this.state.userLatitude,
            longitude: this.state.userLongitude
          }}
          />
        <MapView.Marker
          coordinate={{
            latitude: this.state.latitude,
            longitude: this.state.longitude
          }}
          onPress={() => this.openModal()}
          >
        <Image
          source={require('./node_modules/assets/logo.png')}
          style={{width:40, height:40}} />
        </MapView.Marker>
        </MapView>

        <Modal
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.closeModal()}
        >
        <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
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
              <Button
              onPress={() => this.closeModal()}
              title="Close"
              >
              </Button>
            </View>
          </View>
          </ScrollView>
        </Modal>
        <Button
          onPress={() => this.openModal()}
          title="View data"
        />
      </View>
    );
  }
}
