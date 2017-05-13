import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    AsyncStorage
} from 'react-native';
import {Toolbar, Button, ListItem, Subheader} from 'react-native-material-ui'
import config from '../config.json'

export class SearchScreen extends Component {
    state = {
        account: '',
        course: null,
        queryclass: null,
        loading: false,
        record: []
    }

    componentWillMount() {
        AsyncStorage.getItem('logInUser').then(
            logInUser => {
                if (logInUser) {
                    const tmp = JSON.parse(logInUser)
                    this.setState({account: tmp.account})
                }
            }
        )
    }

    searchPress = () => {
        console.log(this.state)
        if (!this.state.queryclass) {
            alert('请填写班级号')
            return
        }
        this.state.course ? this.fetchcourse() : this.fetchclass()

    }

    fetchcourse = async() => {
        this.setState({loading: true})
        const res = await fetch(`${config.server}/Message`, {
            method: 'POST',
            headers: {
                'Accepet': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queryType: "4",
                queryclass: this.state.queryclass,
                course: this.state.course
            })
        })
        this.setState({loading: false})
        if (!res.ok) {
            alert('与服务器连接失败')
            return
        }

        const r = await res.json()
        const tmp = [].concat(this.state.record, r)
        this.setState({record: tmp})
    }

    fetchclass = async() => {
        this.setState({loading: true})
        const res = await fetch(`${config.server}/Message`, {
            method: 'POST',
            headers: {
                'Accepet': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queryType: "3",
                queryclass: this.state.queryclass
            })
        })

        this.setState({loading: false})
        if (!res.ok) {
            alert('与服务器连接失败')
            return
        }

        const r = await res.json()
        const tmp = [].concat(this.state.record, r)
        this.setState({record: tmp})
    }

    addRecord = async() => {
        const res = await fetch(`${config.server}/SignInChange`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                changeType: "0",
                course: this.state.course,
                studentid: this.state.stuAccount
            })
        })

        if (!res.ok) {
            alert('与服务器的连接失败')
            return
        }
        alert('修改成功')
        this.searchPress()
    }

    reduceRecord = async() => {
        const res = await fetch(`${config.server}/SignInChange`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                changeType: "1",
                course: this.state.course,
                studentid: this.state.stuAccount
            })
        })
        if (!res.ok) {
            alert('与服务器的连接失败')
            return
        }
        alert('修改成功')
        this.searchPress()
    }

    renderRecord() {
        const {record} = this.state
        const data = {record}

        return (
            <View>
                {data.record.map((v, index) =>
                    <View key={index}>
                        <Subheader
                            text={`${index + 1}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>姓名</Text>}
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
                        <View style={styles.buttonBox}>
                            <Button
                                primary
                                raised
                                icon="exposure-plus-1"
                                text="次数"
                                onPress={this.addRecord}
                            />
                            <Button
                                primary
                                raised
                                icon="exposure-neg-1"
                                text="次数"
                                onPress={this.reduceRecord}
                            />
                        </View>
                    </View>
                )}
            </View>
        )
    }

    render() {
        const {goBack} = this.props.navigation

        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="查询考勤记录"
                    onLeftElementPress={() => goBack()}
                />
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="班级号（必填）"
                        keyboardType="numeric"
                        onChangeText={queryclass => this.setState({queryclass})}
                    />
                    <TextInput
                        style={styles.inputText}
                        placeholder="课程名称"
                        onChangeText={course => this.setState({course})}
                    />
                </View>

                <View style={styles.searchBox}>
                    <View style={styles.searchButton}>
                        {this.state.loading ?
                            <Button
                                raised
                                disabled
                                text="搜索中..."
                            /> :
                            <Button
                                primary
                                raised
                                icon="search"
                                text="搜索"
                                onPress={this.searchPress}
                            />
                        }
                    </View>

                </View>

                {this.state.record &&
                this.renderRecord()
                }

            </ScrollView>
        )
    }
}

const
    styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        inputBox: {
            margin: 10,
            alignItems: 'center'
        },
        inputText: {
            height: 40,
            width: 300,
        },
        searchBox: {
            alignItems: 'center'
        },
        searchButton: {
            width: 300
        },
        buttonBox: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
        },
    });