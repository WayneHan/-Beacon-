import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
    DeviceEventEmitter,
} from 'react-native';
import {Button, Toolbar} from 'react-native-material-ui';
import Beacons from 'react-native-beacons-manager';

export class BcnScreen extends Component {

    constructor(props) {
        super(props);
        // Create our dataSource which will be displayed in the ListView
        var ds = new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }
        );
        this.state = {
            // region information
            uuidRef: null,
            // React Native ListView datasource initialization
            dataSource: ds.cloneWithRows([]),
            isPressed: true
        };
    }

    /*componentWillMount() {
        // Tells the library to detect iBeacons
        Beacons.detectIBeacons()

        const uuid = this.state.uuidRef;
        // Start detecting all iBeacons in the nearby
        Beacons.startRangingBeaconsInRegion('REGION1', uuid)
            .then(
                () => console.log('Beacons ranging started succesfully')
            )
            .catch(
                error => console.log(`Beacons ranging not started, error: ${error}`)
            );

        // Print a log of the detected iBeacons (1 per second)
        DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            console.log('Found beacons!', data.beacons)
        })

    }*/

    componentDidMount() {
        //
        // component state aware here - attach events
        //
        // Ranging:
        this.beaconsDidRange = DeviceEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {
                console.log(data)
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(data.beacons)
                });
            }
        );
    }

    componentWillUnMount() {
        this.beaconsDidRange = null;
    }

    onSearchBeacon = () => {
        Beacons.detectIBeacons();

        const uuid = this.state.uuidRef;
        console.log('Detecting Beacons');
        Beacons.startRangingBeaconsInRegion('REGION1', uuid)
            .then(
                () => console.log('Beacons ranging started succesfully')
            )
            .catch(
                error => console.log('Beacons ranging not started, error: ${error}')
            );

        DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            console.log('Found beacons!', data.beacons)
        });

        //setTimeout(Beacons.stopRangingBeaconsInRegion('REGION1', uuid), 5000);
    }

    render() {
        const {goBack} = this.props.navigation;
        const {dataSource} = this.state;
        return (
            <View style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="发现Beacon"
                    onLeftElementPress={() => goBack()}
                />
                <View style={styles.listContainer}>
                    <View style={styles.buttonBox}>
                        <Button
                            raised
                            icon="touch-app"
                            text="打开蓝牙，搜索附近 Beacon 设备"
                            onPress={this.onSearchBeacon}
                        />
                    </View>
                    <ListView
                        dataSource={ dataSource }
                        enableEmptySections={ true }
                        renderRow={this.renderRow}
                    />
                </View>
            </View>
        );
    }

    renderRow = rowData => {
        return (
            <View style={styles.row}>
                <Text style={styles.smallText}>
                    UUID: {rowData.uuid ? rowData.uuid : 'NA'}
                </Text>
                <Text style={styles.smallText}>
                    Major: {rowData.major ? rowData.major : 'NA'}
                </Text>
                <Text style={styles.smallText}>
                    Minor: {rowData.minor ? rowData.minor : 'NA'}
                </Text>
                <Text>
                    RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
                </Text>
                <Text>
                    Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
                </Text>
                <Text>
                    Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBox: {
        width: 300,
        alignItems: 'center',
    }
})