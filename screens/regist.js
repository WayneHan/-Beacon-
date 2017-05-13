import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Picker
} from 'react-native';
import {Toolbar, Button} from 'react-native-material-ui';
import config from '../config'

export class RegistScreen extends Component {
    state = {
        account: null,
        password: null,
        isStudent: true,
        loading: false
    }

    onSignUpPress = async () => {
        if ((this.state.account == null) || (this.state.password == null)){
            alert('请填写完整信息')
            return
        }
        this.setState({loading: true})
        const status = this.state.isStudent
        console.log(JSON.stringify({
            account: this.state.account,
            password: this.state.password,
            status: status}))
        const res = await fetch(`${config.server}/AppRegister`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: this.state.account,
                password: this.state.password,
                status: status
            })
        })

        console.log(res)
        this.setState({loading: false})
        if(!res.ok) {
            alert('与服务器的连接失败')
            return
        }
        const r = await res.json()
        if(!r.isValid) {
            alert('注册失败，请检查注册信息')
            return
        }
        alert('注册成功，请重新登陆')
        this.props.navigation.goBack()
    }

    render() {
        const {goBack} = this.props.navigation;

        return (
            <View style={{flex: 1}}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="用户注册"
                    onLeftElementPress={() => goBack()}
                />
                <View style={styles.container}>
                    <View style={styles.pickerBox}>
                        <Text>您的身份：</Text>
                        <Picker
                            selectedValue={this.state.isStudent}
                            onValueChange={(status) => this.setState({isStudent: status})}>
                            <Picker.Item label="学生" value={true} />
                            <Picker.Item label="教师" value={false} />
                        </Picker>

                    </View>
                    <View style={styles.inputBox}>
                        <TextInput style={styles.inputText}
                                   keyboardType="numeric"
                                   placeholder="学号／教工号"
                                   onChangeText={(account) => this.setState({account})}/>
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput style={styles.inputText}
                                   placeholder="设置密码"
                                   secureTextEntry={true}
                                   onChangeText={(password) => this.setState({password})}/>
                    </View>

                    <View style={styles.buttonBox}>
                        {this.state.loading ?
                            <Button
                                raised
                                disabled
                                icon="check"
                                text="注册中..."
                            /> :
                            <Button
                                raised primary
                                icon="check"
                                text="提交信息并注册"
                                onPress={this.onSignUpPress}
                            />
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
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
    pickerBox: {
        width:100,
        marginLeft: 25
    }
});