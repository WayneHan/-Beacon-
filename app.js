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
import Spinner from 'react-native-loading-spinner-overlay';
import {RegistScreen} from './screens/regist';
import {BcnScreen} from  './screens/findBcn';
import {EditScreen} from './screens/edit';
import {TCurrScreen} from './screens/Tcurriculum';
import {resetScreen} from './screens/screenreset';
import {SCurrScreen} from './screens/Scurriculum';
import {checkScreen} from './screens/checkAttendence'
import {reportScreen} from './screens/reportAttendence'
import {SearchScreen} from './screens/Tsearch'

class HomeScreen extends Component {
    state = {
        isStudent: false,
        account: null
    }

    componentDidMount() {
        AsyncStorage.getItem('logInUser').then(
            logInUser => {
                const tmp = JSON.parse(logInUser)
                this.setState({isStudent: tmp.isStudent, account: tmp.account})
            }
        )
    }

    checkcurr = () => {
        const {navigate} = this.props.navigation
        this.state.isStudent ? navigate('SCurr', {account: this.state.account}) : navigate('TCurr', {account: this.state.account})
    }

    signout = async() => {
        await AsyncStorage.clear()
        alert('登出成功')
        this.props.navigation.dispatch(resetScreen('Initial'))
    }

    editpassword = () => {
        const {navigate} = this.props.navigation
        navigate('Edit')
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
        const {navigate} = this.props.navigation

        return (
            <View style={styles.homeContainer}>
                <Toolbar
                    centerElement="课程签到系统"
                    leftElement="person"
                />
                <View>
                    <View>
                        <Button
                            key="1"
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

                    {this.state.isStudent &&
                        <View>
                            <Button
                                style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                                raised
                                icon="location-on"
                                text="考勤签到"
                                onPress={this.reportattendence}
                            />
                        </View>
                    }

                    <View>
                        <Button
                            style={{container: {flexDirection: 'row', justifyContent: 'flex-start'}}}
                            raised
                            icon="edit"
                            text="修改密码"
                            onPress={this.editpassword}
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
        account: null,
        password: null,
        loading: false
    }

    componentDidMount() {
        AsyncStorage.getItem('logInUser').then(
            logInUser => {
                if (logInUser) {
                    this.props.navigation.dispatch(resetScreen('Home'))
                }
            }
        )
    }

    onSignInPress = async() => {
        if ((this.state.account == null) || (this.state.password == null)){
            alert('请填写完整信息')
            return
        }
        this.setState({loading: true})
        const res = await fetch(`http://coursesigninsys.duapp.com/AppSignIn`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                account: this.state.account,
                password: this.state.password
            })
        })
        if (!res.ok) {
            alert('与服务器连接失败，请重试')
            return
        }

        this.setState({loading: false})
        const r = await res.json()
        if (!r.isValid) {
            alert('登陆失败，请检查账号和登陆密码')
            return
        }
        alert('登陆成功')
        await AsyncStorage.setItem('logInUser', JSON.stringify({
            account: this.state.account,
            isStudent: r.isStudent
        }))
        this.props.navigation.dispatch(resetScreen('Home'))
    }

    render() {
        const {navigate} = this.props.navigation

        return (
            <View style={styles.container}>
                <Text style={styles.headLine}>
                    学生课程签到系统
                </Text>

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


                <View style={styles.buttonBox}>
                    {this.state.loading ?
                        <View style={styles.signInButton}>
                            <Button
                                raised
                                disabled
                                icon="check"
                                text="登陆中..."
                            />
                        </View> :
                        <View style={styles.signInButton}>
                            <Button
                                raised
                                primary
                                icon="check"
                                onPress={this.onSignInPress}
                                text="登陆"
                            />
                        </View>
                    }
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
    Edit: {
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
