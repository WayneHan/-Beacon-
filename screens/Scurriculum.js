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
import {Toolbar, ListItem, Subheader, Button} from 'react-native-material-ui'
import Spinner from 'react-native-loading-spinner-overlay'
import Beacons from 'react-native-beacons-manager'
import config from '../config.json'

export class SCurrScreen extends Component {
    state = {
        account: null,
        uuid: '',
        loading: true,
        isPress: false,
        beacons: {},
        curr: []
    }

    fetchscurr = async () => {
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
                queryType: "0",
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
        if(this.state.loading){
            this.fetchscurr()
        }
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            console.log('Found :', data.beacons)
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

    reportatt = () => {
        Beacons.detectIBeacons()
        this.setState({isPress: true})
        this.found = false
        Beacons.startRangingBeaconsInRegion('REGION1').then(
            () => console.log('****** start ranging beacons ******')
        ).catch(
            error => {
                console.log('start ranging beacons failed')
                alert('搜素beacon失败，请重试')
                this.setStte({isPress: false})
            }
        )
    }

    fetchresult = async () => {
        console.log(JSON.stringify({
            checkType: "0",
            studentid: this.state.account,
            uuid: this.state.uuid
        }))
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
        this.setState({isPress: false})
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
        const {goBack} = this.props.navigation;
        const {curr} = this.state
        const data = {curr}
        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="学生课程信息"
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
                            leftElement={<Text>学生姓名</Text>}
                            centerElement={`${v.studentname}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>课程名称</Text>}
                            centerElement={`${v.course}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>签到次数</Text>}
                            centerElement={`${v.total}`}
                        />
                        {this.state.isPress ?
                            <Button
                                primary
                                disabled
                                text="签到中..."
                                onPress={this.closeRecord}
                            /> :
                            <Button
                                primary
                                raised
                                text="考勤签到"
                                onPress={this.reportatt}
                            />
                        }
                    </View>
                )}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});