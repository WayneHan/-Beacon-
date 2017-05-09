import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    AsyncStorage
} from 'react-native';
import {Toolbar, Button} from 'react-native-material-ui';
import config from '../config.json'

export class EditScreen extends Component {
    state = {
        account: '',
        isStudent: '',
        loading: false,
        preCode: '',
        newCode: ''
    }

    componentWillMount() {
        AsyncStorage.getItem('logInUser').then(
            logInUser => {
                if (logInUser) {
                    const tmp = JSON.parse(logInUser)
                    this.setState({account: tmp.account, isStudent: tmp.isStudent})
                }
            }
        )
    }

    handleEdit = async() => {
        if ((this.state.preCode == null) || (this.state.newCode == null)){
            alert('请填写完整信息')
            return
        }
        if(this.state.preCode === this.state.newCode) {
            alert('请使用新密码')
            return
        }
        this.setState({loading: true})
        const res = await fetch(`${config.server}/AppRegister`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: this.state.account,
                password: this.state.newCode,
                status: this.state.isStudent
            })
        })

        this.setState({loading: false})
        if (!res.ok) {
            alert('与服务器的连接失败')
            return
        }
        const r = await res.json()
        if (!r.isValid) {
            alert('修改失败')
            return
        }
        alert('修改成功')
    }


    render() {
        const {goBack} = this.props.navigation;

        return (
            <View style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="修改密码"
                    onLeftElementPress={() => goBack()}
                />

                <View style={styles.inputField}>
                    <View style={styles.inputBox}>
                        <TextInput style={styles.inputText}
                                   placeholder="旧密码"
                                   secureTextEntry={true}
                                   onChangeText={(preCode) => this.setState({preCode})}/>
                    </View>

                    <View>
                        <TextInput style={styles.inputText}
                                   placeholder="新密码"
                                   secureTextEntry={true}
                                   onChangeText={(newCode) => this.setState({newCode})}/>
                    </View>

                    <View style={styles.buttonBox}>
                        {this.state.loading ?
                            <Button
                                raised
                                disabled
                                text="正在修改..."
                            /> :
                            <Button
                                raised primary
                                icon="check"
                                text="确认修改"
                                onPress={this.handleEdit}
                            />
                        }
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputField: {
        flex: 1,
        alignItems: 'center',
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