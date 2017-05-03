import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    DeviceEventEmitter
} from 'react-native';
import {Toolbar, Button} from 'react-native-material-ui';
import Beacons from 'react-native-beacons-manager';
import config from '../config'

export class reportScreen extends Component {
    state = {
        account: this.props.navigation.state.account,
        course: '',
        uuidRef: '',
        beacons: {}
    }

    reportatt = () => {
        Beacons.detectIBeacons()
        const uuid = this.state.uuidRef
        Beacons.startRangingBeaconsInRegion('REGION1', uuid).then(
            () => console.log('start ranging beacons')
        ).catch(
            error => console.log('beacon ranging failed')
        )

        DeviceEventEmitter.addListener('beaconDidRange', (data) => {
            console.log(data.beacons)
            this.setState({beacons: data.beacons})
        })
        let getData = (data) => {
            console.log('getData', data.beacons)
        }

        Beacons.stopRangingBeaconsInRegion('REGION!', uuid).then(
            () => console.log('stop ranging beacons')
        ).catch(
            error => console.log('failed to stop ranging beacons')
        )

        this.fetchresult()
    }

    fetchresult = () => {
        const {params} = this.state
        fetch(`${config.server}/checkattendence`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                checkType: false,
                studentid: params.account,
                //uuid: params.beacons
            })
        }).then(res => {
            if(!r.ok) {
                alert('与服务器的连接失败')
                return
            }
            return res.json().then(r => {
                if(!r.isValid) {
                    alert('签到失败，请重试')
                    return
                }
                alert('签到成功')
            })
        })
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

                <View style={styles.inputBox}>
                    <TextInput style={styles.inputText}
                               placeholder="课程代码"
                               onChangeText={(course) => this.setState({course})}/>
                </View>
                <Button
                    primary
                    raised
                    text="打开蓝牙，记性签到"
                    onPress={this.reportatt}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    inputBox: {
        alignItems: 'center',
        margin: 10,
    },
    inputText: {
        height: 40,
        width: 300,
    },
    buttonBox: {
        alignItems: 'center',
        marginTop: 30,
    },
});