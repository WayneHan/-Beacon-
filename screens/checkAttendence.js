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

export class checkScreen extends Component {
    state = {
        account: this.props.navigation.state.account,
        course: '',
        uuidRef: '',
        beacons: {}
    }

    checkatt = () => {
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
        fetch(`${config.server}/checkattendence`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                signinReq: true
            })
        }).then(res => {
            if(!res.ok) {
                alert('与服务器的连接失败')
                return
            }
            return res.json().then(r => {
                if(!r.isValid) {
                    alert('发起失败，请重试')
                    return
                }
                alert('发起成功，请通知学生进行签到')
            })
        })
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

                <View style={styles.inputBox}>
                    <TextInput style={styles.inputText}
                               placeholder="课程代码"
                               onChangeText={(course) => this.setState({course})}/>
                </View>
                <Button
                    primary
                    raised
                    text="开启蓝牙，发起考勤"
                    onPress={this.checkatt}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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