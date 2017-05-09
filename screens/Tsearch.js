import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    AsyncStorage
} from 'react-native';
import {Toolbar, Button, ListItem} from 'react-native-material-ui'
import config from '../config.json'

export class SearchScreen extends Component {
    state = {
        account: '',
        course: '',
        stuAccount: '',
        loading: false,
        record: null
    }

    componentWillMount() {
        AsyncStorage.getItem('logInUser').then(
            logInUser => {
                if (logInUser) {
                    const tmp = JSON.parse(logInUser)
                    this.setState({accout: tmp.account})
                }
            }
        )
    }

    searchPress = async() => {
        if ((this.state.stuAccount == null) || (this.state.course == null)){
            alert('请填写完整信息')
            return
        }
        this.setState({loading: true})
        const res = await fetch(`${config.server}/Message`, {
            method: 'POST',
            headers: {
                'Accepet': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queryType: "2",
                course: this.state.course,
                id: this.state.stuAccount,
            })
        })

        this.setState({loading: false})
        if (!res.ok) {
            alert('与服务器连接失败')
            return
        }

        const r = await res.json()
        this.setState({record: r})
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

    render() {
        const {goBack} = this.props.navigation
        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="修改记录"
                    onLeftElementPress={() => goBack()}
                />
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="课程名称"
                        onChangeText={course => this.setState({course})}
                    />
                    <TextInput
                        style={styles.inputText}
                        placeholder="学号"
                        keyboardType="numeric"
                        onChangeText={stuAccount => this.setState({stuAccount})}
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
                <View>
                    <ListItem
                        divider
                        leftElement={<Text>姓名</Text>}
                        centerElement={`${this.state.record.studentname}`}
                    />
                    <ListItem
                        divider
                        leftElement={<Text>班级</Text>}
                        centerElement={`${this.state.record.class}`}
                    />
                    <ListItem
                        divider
                        leftElement={<Text>签到次数</Text>}
                        centerElement={`${this.state.record.total}`}
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