import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView
} from 'react-native';
import {Toolbar, Button, ListItem} from 'react-native-material-ui'
import config from '../config.json'

export class SearchScreen extends Component {
    state = {
        account: this.props.navigation.state.account,
        course: '',
        stuAccount: '',
        record: {}
    }

    searchPress = () => {
        const {params} = this.state
        fetch(`${config.server}/Message`, {
            method: 'POST',
            headers: {
                'Accepet': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queryType: '2',
                course: params.course,
                studentid: params.stuAccount,
            })
        }).then(res => {
            if (!r.ok) {
                alert('搜索失败，请重试')
                return
            }
            return res.json().then(r => {
                this.setState({record: {name: r.name, class: r.class, total: r.total}})
            })
        }).catch(
            (error) => console.log(error.message)
        )
    }


    addRecord = () => {
        const {params} = this.state
        fetch(`${config.server}/SignInChange`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                changeType: false,
                course: params.course,
                studentid: params.stuAccount
            })
        }).then(res => {
            if (!res.ok) {
                alert('与服务器的连接失败')
                return
            }
            return res.json().then(r => {
                alert('修改成功, 请重新查询')
            })
        }).catch(
            (error) => console.log(error.message)
        )
    }

    reduceRecord = () => {
        const {params} = this.state
        fetch(`${config.server}/SignInChange`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                changeType: true,
                course: params.course,
                studentid: params.stuAccount,
                //allocationcode: params.coursecode
            })
        }).then(res => {
            if (!res.ok) {
                alert('修改失败')
                return
            }
            return res.json().then(r => {
                alert('修改成功，请重新查询')
            })
        }).catch(
            (error) => console.log(error.message)
        )
    }

    render() {
        const {goBack} = this.props.navigation;
        const {record} = this.state;
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
                        onChangeText={course => {
                            this.setState(course)
                        }}
                    />
                    <TextInput
                        style={styles.inputText}
                        placeholder="学号"
                        onChangeText={stuAccount => {
                            this.setState(stuAccount)
                        }}
                    />
                </View>

                <View style={styles.searchBox}>
                    <View style={styles.searchButton}>
                        <Button
                            primary
                            raised
                            icon="search"
                            text="搜索"
                            onPress={this.searchPress}
                        />
                    </View>

                </View>


                {record.name && [
                    <ListItem
                        divider
                        leftElement={<Text>姓名</Text>}
                        centerElement={`${record.name}`}
                    />,
                    <ListItem
                        divider
                        leftElement={<Text>班级</Text>}
                        centerElement={`${record.class}`}
                    />,
                    <ListItem
                        divider
                        leftElement={<Text>签到次数</Text>}
                        centerElement={`${record.total}`}
                    />,
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
                    </View>]
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