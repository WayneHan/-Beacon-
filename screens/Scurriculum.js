import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    AsyncStorage
} from 'react-native';
import {Toolbar, ListItem, Subheader} from 'react-native-material-ui'
import Spinner from 'react-native-loading-spinner-overlay'
import config from '../config.json'

export class SCurrScreen extends Component {
    state = {
        account: null,
        loading: true,
        curr: []
    }

    fetchscurr = async () => {
        await AsyncStorage.getItem('logInUser').then(
            logInUser => {
                const tmp = JSON.parse(logInUser)
                this.setState({account: tmp.account})
            }
        )

        const res = await fetch(`${config.server}/Message`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                queryType: "0",
                id: this.state.account
            })
        })
        this.setState({loading: false})
        if (!res.ok) {
            alert('没有符合条件的课程')
            return
        }
        const r = await res.json()
        const tmp = [].concat(this.state.curr, r)
        this.setState({curr: tmp})
    }

    componentWillMount() {
        this.fetchscurr()
    }

    render() {
        const {goBack} = this.props.navigation;
        const {curr} = this.state
        const data = {curr}
        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="学生课程信息"
                    onLeftElementPress={() => goBack()}
                />
                {this.state.loading ?
                    <Spinner
                        visible={true}
                        textContent={"Loading..."}
                    /> :
                    <Spinner
                        visible={false}
                    />
                }
                {data.curr.map((v, index) =>
                    <View style={{flex: 1}} key={index}>
                        <Subheader
                            text={`${index + 1}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>学生姓名</Text>}
                            centerElement={`${v.studentname}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>课程名称</Text>}
                            centerElement={`${v.course}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>签到次数</Text>}
                            centerElement={`${v.total}`}
                        />
                    </View>
                )}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});