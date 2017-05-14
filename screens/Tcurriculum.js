import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import { Toolbar, ListItem, Button, Subheader} from 'react-native-material-ui'
import config from '../config.json'
import Spinner from 'react-native-loading-spinner-overlay'
import Beacons from 'react-native-beacons-manager'

export class TCurrScreen extends Component {
    state = {
        account: null,
        loading: true,
        uuid: '',
        isRecord: false,
        beacons: {},
        curr: []
    }

    fetchscurr = async () => {
        this.setState({loading: true})
        await AsyncStorage.getItem('logInUser').then(
            logInUser => {
                const tmp = JSON.parse(logInUser)
                this.setState({account: tmp.account})
            }
        )

        const res = await fetch(`${config.server}/Message`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                queryType: "1",
                id: this.state.account
            })
        })
        this.setState({loading: false})
        if (!res.ok) {
            alert('没有符合条件的课程')
            return
        }
        const r = await res.json()
        const tmp = [].concat(this.state.curr, r)
        this.setState({curr: tmp})
    }

    componentWillMount() {
        if(this.state.loading) {
            this.fetchscurr()
        }
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            console.log('Found :', data.beacons)
            this.flag += 1
            if(this.flag >= 8 && !this.state.uuid) {
                alert('无法搜索Beacon，请检查是否打开蓝牙或者附近是否存在Beacon设备')
                Beacons.stopRangingBeaconsInRegion('REGION1').then(
                    () => {
                        console.log('****** stop ranging beacons ******')
                    }
                ).catch(
                    error => console.log('stop ranging beacons failed')
                )
                this.setState({isRecord: false})
            }

            if (data.beacons.length) {
                let tmp = data.beacons
                console.log("closest beacon :", tmp.sort(this.sort_by('rssi')))
                this.setState({uuid: tmp[0].uuid.toUpperCase()})
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
        this.setState({isRecord: true})

        this.found = false
        this.flag = 1
        Beacons.startRangingBeaconsInRegion('REGION1').then(
            () => console.log('****** start ranging beacons ******')
        ).catch(
            error => {
                console.log('start ranging beacons failed')
                alert('搜索beacon失败，请重试')
            }
        )
    }

    transferDay = (day) => {
        switch (day) {
            case 0:
                return '星期日'
            case 1:
                return '星期一'
            case 2:
                return '星期二'
            case 3:
                return '星期三'
            case 4:
                return '星期四'
            case 5:
                return '星期五'
            case 6:
                return '星期六'
        }
    }

    fetchresult = async () => {
        const date = new Date()
        const day = date.getDay()
        const hours = date.getHours()
        let week = this.transferDay(day)

        console.log(JSON.stringify({
            signinReq: "0",
            uuid: this.state.uuid,
            week: week,
            hours: hours,
            minute: "30"
        }))
        const res = await fetch(`${config.server}/CheckAttendence`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                signinReq: "0",
                uuid: this.state.uuid,
                week: week,
                hours: hours,
                minute: "30"
            })
        })
        console.log(res)
        if (!res.ok) {
            this.setState({isRecord: false})
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

        if (!res.ok) {
            alert('与服务器的连接失败')
            return
        }

        const r = res.json()
        this.setState({isRecord: false})
        if (!r.isValid) {
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
        const {curr} = this.state
        const data = {curr}
        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="教师课程信息"
                    onLeftElementPress={() => goBack()}
                />

                {this.state.loading ?
                    <Spinner
                        visible={true}
                        textContent={"Loading..."}
                    /> :
                    <Spinner
                        visible={false}
                    />
                }
                {data.curr.map((v, index) =>
                    <View style={{flex: 1}} key={index}>
                        <Subheader
                            text={`${index + 1}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>班级</Text>}
                            centerElement={`${v.class}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>课程名称</Text>}
                            centerElement={`${v.course}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>课室</Text>}
                            centerElement={`${v.classroom}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>课室</Text>}
                            centerElement={`${v.time}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>日期</Text>}
                            centerElement={`${v.week}`}
                        />
                        {this.state.isRecord ?
                            <Button
                                raised
                                accent
                                text="结束考勤"
                                onPress={this.closeRecord}
                            /> :
                            <Button
                                primary
                                raised
                                text="发起考勤"
                                onPress={this.checkatt}
                            />
                        }
                    </View>
                    )
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});