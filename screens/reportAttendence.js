import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    DeviceEventEmitter,
    AsyncStorage
} from 'react-native';
import {Toolbar, Button} from 'react-native-material-ui';
import Beacons from 'react-native-beacons-manager';
import config from '../config'

export class reportScreen extends Component {
    state = {
        account: '',
        uuid: '',
        beacons: {}
    }

    componentWillMount() {
        AsyncStorage.getItem('logInUser').then(logInUser => {
            if (logInUser) {
                const tmp = JSON.parse(logInUser)
                this.setState({account: tmp.account})
            }
        })
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            console.log('Found :', data.beacons)
            if (data.beacons.length) {
                let tmp = data.beacons
                console.log("closest beacon :", tmp.sort(this.sort_by('rssi')))
                this.setState({uuid: tmp[0].uuid})
                this.onFoundBeacon()
            }
        });
    }

    onFoundBeacon() {
        if (this.found) {
            return
        }
        this.found = true

        this.fetchresult()
        Beacons.stopRangingBeaconsInRegion('REGION1').then(
            () => {
                console.log('****** stop ranging beacons ******')
            }
        ).catch(
            error => console.log('stop ranging beacons failed')
        )
    }

    sort_by = (field, reverse, primer) => {
        let key = primer ?
            (x) => {
                return primer(x[field])
            } : (x) => {
                return x[field]
            };
        reverse = !reverse ? 1 : -1;

        return (a, b) => {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    reportatt = () => {
        Beacons.detectIBeacons()
        this.found = false
        Beacons.startRangingBeaconsInRegion('REGION1').then(
            () => console.log('****** start ranging beacons ******')
        ).catch(
            error => {
                console.log('start ranging beacons failed')
                alert('搜素beacon失败，请重试')
            }
        )
    }

    fetchresult = async () => {
        const res = await fetch(`${config.server}/ReportAttendence`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                checkType: "0",
                studentid: this.state.account,
                uuid: this.state.uuid
            })
        })
        if (!res.ok) {
            alert('与服务器的连接失败')
            return
        }
        const r = await res.json()
        if (!r.isValid) {
            alert('签到失败，请重试')
            return
        }
        alert('签到成功')
    }

    componentWillUnmount() {
        this.beaconDidRange = null
    }

    render() {
        const {goBack} = this.props.navigation
        return (
            <View style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="签到考勤"
                    onLeftElementPress={() => goBack()}
                />

                <View style={styles.textBox}>
                    <Text>
                        请打开手机蓝牙功能，然后在课室 Beacon 设备附近进行签到
                    </Text>
                </View>

                <Button
                    primary
                    raised
                    text="开始签到"
                    onPress={this.reportatt}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textBox: {
        margin: 15
    }
});