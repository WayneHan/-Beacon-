import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Toolbar, Button} from 'react-native-material-ui';

export class RegistScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          account: null,
            idnum: null,
            password: null,
        };
    }

    onSignUpPress = () => {
        fetch('localhost:3000/signUp', {
            method: 'POST',
            body: JSON.stringify({
                signUpaccount: this.state.account,
                signUpId: this.state.idnum,
                signUpPassword: this.state.password,
            })
        })
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
                        <View style={styles.inputBox}>
                            <TextInput style={styles.inputText}
                                       keyboardType="numeric"
                                       placeholder="学号／教工号"
                                       onChangeText={(account) => this.setState({account})}/>
                        </View>

                        <View style={styles.inputBox}>
                            <TextInput style={styles.inputText}
                                       keyboardType="numeric"
                                       placeholder="身份证号码"
                                       onChangeText={(idnum) => this.setState({idnum})}/>
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
});