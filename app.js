import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    AsyncStorage
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {Toolbar, Button, COLOR, ThemeProvider} from 'react-native-material-ui';
import {RegistScreen} from './screens/regist';
import {BcnScreen} from  './screens/findBcn';
import {EditScreen} from './screens/edit';
import {CurrScreen} from './screens/curriculum';

class HomeScreen extends Component {
    render() {
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.homeContainer}>
                <Toolbar
                    centerElement="Username"
                    leftElement="person"
                />
                <View>
                    <View>
                        <Button
                            style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                            raised
                            icon="info-outline"
                            text="课程信息"
                            onPress={() => navigate('Curriculum')}
                        />
                    </View>
                    <View>
                        <Button
                            style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                            raised
                            icon="search"
                            text="发现Beacon"
                            onPress={() => navigate('FindBcn')}
                        />
                    </View>
                    <View>
                        <Button
                            style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                            raised
                            icon="edit"
                            text="修改密码"
                            onPress={() => navigate('EditCode')}
                        />
                    </View>

                </View>
            </View>
        );
    }
}

class InitialScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: null,
            password: null,
            isValid: false,
            isStudent: true
        }
    }

    onSignInPress = () => {
        fetch('localhost:3000/signIn', {
            method: 'POST',
            body: JSON.stringify({
                signInAccount: this.state.account,
                signInPassword: this.state.password,
            })
        }).then((response) => response.isValid == true ? () => {
                await AsyncStorage.setItem(this.state.account)
            } : console.log(error))
    }


    render() {
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.headLine}>
                        学生课程签到系统
                    </Text>
                </View>

                <View>
                    <View style={styles.inputBox}>
                        <TextInput style={styles.inputText}
                                   placeholder="学号/教工号"
                                   keyboardType="numeric"
                                   onChangeText={(account) => this.setState({account})}/>
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput style={styles.inputText}
                                   placeholder="密码"
                                   secureTextEntry={true}
                                   onChangeText={(password) => this.setState({password})}/>
                    </View>
                </View>


                <View style={styles.buttonBox}>
                    <View style={styles.signInButton}>
                        <Button
                            raised primary
                            icon="check"
                            onPress={this.onSignInPress}
                            text="登陆"
                        />
                    </View>
                    <View style={styles.signUpButton}>
                        <Button
                            onPress={() => navigate('Register')}
                            text="注册"
                        />
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    homeContainer: {
        flex: 1,
    },
    inputBox: {
        alignItems: 'center',
        margin: 10,
    },
    headLine: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50,
    },
    inputText: {
        height: 40,
        width: 300,
    },
    buttonBox: {
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    signInButton: {
        width: 300,
        marginBottom: 10,
    },
    signUpButton: {
        width: 300,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

const Initial = StackNavigator({
    Initial: {
        screen: InitialScreen
    },
    Register: {
        screen: RegistScreen
    },
    Home: {
        screen: HomeScreen
    },
    FindBcn: {
        screen: BcnScreen,
    },
    EditCode: {
        screen: EditScreen,
    },
    Curriculum: {
        screen: CurrScreen,
    }
}, {
    headerMode: 'none'
});

const App = () => (
    <ThemeProvider>
        <Initial />
    </ThemeProvider>
);

AppRegistry.registerComponent('AwesomeProject', () => App);
