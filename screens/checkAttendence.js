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

export class checkScreen extends Component {
    state = {
        account: '',
        uuid: '',
        isRecord: false,
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

    checkatt = () => {
        Beacons.detectIBeacons()

        this.found = false
        Beacons.startRangingBeaconsInRegion('REGION1').then(
            () => console.log('****** start ranging beacons ******')
        ).catch(
            error => {
                console.log('start ranging beacons failed')
                alert('搜索beacon失败，请重试')
            }
        )
    }

    fetchresult = async() => {
        const res = await fetch(`${config.server}/CheckAttendence`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                signinReq: "0",
                //"uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                uuid: this.state.uuid,
                time: "2"
            })
        })
        console.log(res)
        if (!res.ok) {
            alert('与服务器的连接失败')
            return
        }

        const r = await res.json()
        if (!r.isValid) {
            alert('发起考勤失败，请重试')
            return
        }
        alert('发起考勤成功，请通知学生及时签到')
        this.setState({isRecord: true})

    }

    closeRecord = async () => {
        const res = await fetch(`${config.server}/CloseSignIn`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: this.state.uuid
            })
        })

        if(!res.ok) {
            alert('与服务器的连接失败')
            return
        }

        const r = res.json()
        this.setState({isRecord: false})
        if(!r.isValid) {
            alert('服务器已经结束考勤')
            return
        }
        alert('考勤已结束')
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
                    centerElement="发起考勤"
                    onLeftElementPress={() => goBack()}
                />

                <View style={styles.textBox}>
                    <Text>
                        请打开手机蓝牙功能，然后在课室 Beacon 设备附近发起考勤
                    </Text>
                </View>

                {this.state.isRecord ?
                    <View>
                        <Button
                            disabled
                            raised
                            text="考勤记录中"
                        />
                        <Button
                            primary
                            raised
                            text="结束考勤"
                            onPress={this.closeRecord}
                        />
                    </View> :
                    <View>
                        <Button
                            primary
                            raised
                            text="打开蓝牙，发起考勤"
                            onPress={this.checkatt}
                        />
                        <Button
                            raised
                            disabled
                            text="结束考勤"
                        />
                    </View>

                }
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
    },
    buttonBox: {
        margin: 10
    }
});