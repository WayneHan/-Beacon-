import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView
} from 'react-native';
import {Toolbar, Button, ListItem} from 'react-native-material-ui'

export class SearchScreen extends Component {
    state = {
        account: '',
        classnum: '',
        studentid: '',
        record: {}
    }

    searchPress = () => {
        const {params} = this.state
        fetch(`http://10.206.9.79:3000/signintable/${params.classnum}`, {
            method: 'GET',
            headers: {
                'Accepet': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.isValid) {
                alert('搜索失败，请重试')
                return
            }
            res.json().then(record => {
                this.setState({record})
            })
        })
    }

    render() {
        const {goBack} = this.props.navigation;
        const {record} = this.state.record;
        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="用户注册"
                    onLeftElementPress={() => goBack()}
                />

                <TextInput
                    style={styles.inputText}
                    placeholder="班级编号"
                    onChangeText={classnum => {
                        this.setState(classnum)
                    }}
                />
                <TextInput
                    style={styles.inputText}
                    placeholder="学号"
                    onChangeText={saccount => {
                        this.setState(saccount)
                    }}
                />

                <Button
                    primary
                    raised
                    icon="search"
                    text="搜索"
                    onPress={this.searchPress}
                />

                <View style={styles.buttonBox}>
                    <Button
                        primary
                        raised
                        text="+1"
                    />
                    <Button
                        primary
                        raised
                        text="-1"
                    />

                </View>
                {this.state.record && [
                    <ListItem
                        divider
                        leftElement={<Text>姓名</Text>}
                    />,
                    <ListItem
                        divider
                        leftElement={<Text>课程名称</Text>}
                    />,
                    <ListItem
                        divider
                        leftElement={<Text>签到次数</Text>}
                    />]
                }

            </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
});