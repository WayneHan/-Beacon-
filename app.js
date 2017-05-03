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
import {TCurrScreen} from './screens/Tcurriculum';
import {resetScreen} from './screens/screenreset';
import {SCurrScreen} from './screens/Scurriculum';
import {checkScreen} from './screens/checkAttendence'
import {reportScreen} from './screens/reportAttendence'
import {SearchScreen} from './screens/Tsearch'
//import config from 'config.json'

class HomeScreen extends Component {
    state = {
        isStudent: false,
        account: ''
    }

    ComponentDidMount() {
        //AsyncStorage.getItem
    }

    checkcurr = () => {
        const {navigate} = this.props.navigation
        this.state.isStudent ? navigate('SCurr', {account: this.state.account}) : navigate('TCurr', {account: this.state.account})
    }

    signout = () => {
        const {navigate} = this.props.navigation
        //AsyncStorage.removeItem().then(
        this.setState({isStudent: true})
        navigate.dispatch(resetScreen('Initial'))
    }

    checkattendence = () => {
        const {navigate} = this.props.navigation
        navigate('Check', {account: this.state.account})
    }

    reportattendence = () => {
        const {navigate} = this.props.navigation
        navigate('Report', {account: this.state.account})
    }

    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.state

        return (
            <View style={styles.homeContainer}>
                <Toolbar
                    centerElement="课程签到系统"
                    leftElement="person"
                />
                <View>
                    <View>
                        <Button
                            style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                            raised
                            icon="info-outline"
                            text="课程信息"
                            onPress={this.checkcurr}
                        />
                    </View>

                    {!this.state.isStudent &&
                    <View>
                        <Button
                            style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                            raised
                            icon="mode-edit"
                            text="修改签到记录"
                            onPress={() => navigate('Search', {account: this.state.account})}
                        />
                    </View>
                    }

                    {!this.state.isStudent &&
                    <View>
                        <Button
                            style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                            raised
                            icon="access-alarm"
                            text="发起考勤"
                            onPress={this.checkattendence}
                        />
                    </View>
                    }

                    {this.state.isStudent && [
                        <View>
                            <Button
                                style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                                raised
                                icon="location-on"
                                text="考勤签到"
                                onPress={this.reportattendence}
                            />
                        </View>
                    ]}

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
                            onPress={this.signout}
                        />
                    </View>

                    <View>
                        <Button
                            style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                            raised
                            icon="directions-walk"
                            text="退出登陆"
                            onPress={this.signout}
                        />
                    </View>

                </View>
            </View>
        );
    }
}

class InitialScreen extends React.Component {
    state = {
        account: '',
        password: '',
        isValid: false,
        isStudent: true,
        logInAccount: ''
    }

    componentDidMount() {
        AsyncStorage.getItem('logInUser').then(
            logInAccount => {
                if (logInAccount) {
                    this.props.navigation.dispatch(resetScreen('Home'))
                }
            }
        )
    }

    /*onSignInPress = async() => {
     const res = await fetch(`http://coursesigninsys.duapp.com/Connecttoapp`, {
     method: 'POST',
     headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     },
     body: JSON.stringify({
     account: this.state.account,
     password: this.state.password,
     })
     })
     const r = JSON.parse(res._bodyText)
     if (!r.isValid) {
     alert('登陆失败，请检查账号或密码')
     return
     }
     alert('登陆成功')
     // to be discussed
     //const data = await res.json()
     //await AsyncStorage.setItem('logInAccount', JSON.stringify())
     this.props.navigation.dispatch(resetScreen('Home'))
     }*/

    onSignInPress = () => {
        fetch(`http://coursesigninsys.duapp.com/AppRegister`, {
        //fetch(`http://10.206.9.79:3000/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                account: this.state.account,
                password: this.state.password
            })
        }).then(res => {
            if (!res.ok) {
                alert('与服务器连接失败，请重试')
                return
            }
            return res.json().then(r => {
                if (!r.isValid) {
                    alert('登陆失败，请检查账号或密码')
                    return
                }
                alert('登陆成功')
                this.setState({isStudent: r.isStudent})
                //AsyncStorage.setItem('')
                this.props.navigation.dispatch(resetScreen('Home'))
            })
        }).catch(
            error => console.log(error.message)
        )
    }


render()
{
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
    TCurr: {
        screen: TCurrScreen,
    },
    SCurr: {
        screen: SCurrScreen,
    },
    Search: {
        screen: SearchScreen,
    },
    Check: {
        screen: checkScreen,
    },
    Report: {
        screen: reportScreen,
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
