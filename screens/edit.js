import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Toolbar, Button} from 'react-native-material-ui';

export class EditScreen extends Component {
    render() {
        const { goBack } = this.props.navigation;

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
                                   onChangeText={(curCode) => this.setState({curCode})}/>
                    </View>

                    <View style={styles.buttonBox}>
                        <Button
                            raised primary
                            icon="check"
                            text="确认修改"
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
    },
    inputField: {
        flex: 1,
        alignItems:'center',
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