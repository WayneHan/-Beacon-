import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Toolbar, Button} from 'react-native-material-ui';

export class CurrScreen extends Component {
    render() {
        const {goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="课程信息"
                    onLeftElementPress={() => goBack()}
                />

                <View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});