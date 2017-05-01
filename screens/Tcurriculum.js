import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView
} from 'react-native';
import { Toolbar, ListItem} from 'react-native-material-ui';
import config from '../config.json'

export class TCurrScreen extends Component {
    state = {
        curr: {}
    }

    fetchcurr = () => {
        const teacherid = this.props.navigation.state.account
        fetch(`${config.server}/courseallocation/${teacherid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(!res.isValid) {
                alert('搜索失败，请重试')
                return
            }
            res.json().then(curr => {
                this.setState({curr})
            })
        })
    }

    render() {
        const {goBack} = this.props.navigation
        const {curr} = this.state.curr
        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="课程信息"
                    onLeftElementPress={() => goBack()}
                />

                {this.fetchcurr}
                <ListItem
                    divider
                    leftElement={<Text>班级</Text>}
                />
                <ListItem
                    divider
                    leftElement={<Text>课程名称</Text>}
                />
                <ListItem
                    divider
                    leftElement={<Text>课室</Text>}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});