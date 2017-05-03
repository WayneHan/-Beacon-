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
        isStudent: true
    }

    onSignUpPress = () => {
        fetch(`${config.server}/AppRegister`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: this.state.account,
                password: this.state.password,
                status: this.state.isStudent
            })
        }).then(res => {
            console.log('res = ', res)
            const t = JSON.parse(res._bodyText)
            console('t = ${t}')
            if (t.isValid) {
                alert('注册成功，请重新登陆')
                this.props.navigation.goBack()
            }
            alert('注册失败，请检查注册信息')
        }).catch(
            (error) => console.log(error.message)
        )
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
                            onValueChange={(isStudent) => this.setState({isStudent: isStudent})}>
                            <Picker.Item label="教师" value="false"/>
                            <Picker.Item label="学生" value="true"/>
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
                        <Button
                            raised primary
                            icon="check"
                            text="提交注册"
                            onPress={this.onSignUpPress}
                        />
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