import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView
} from 'react-native';
import {Toolbar, ListItem} from 'react-native-material-ui'

export class SCurrScreen extends Component {
    state = {
        curr: {}
    }

    fetchscurr = () => {
        const studentid = this.props.navigation.state.account
        fetch(`http://10.206.9.79:3000/signintable/${studentid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => {
                if (!res.isValid) {
                    alert('没有符合条件的课程')
                    return
                }
                res.json().then(curr => {
                        this.setState({curr})
                    }
                )
            }
        )
    }

    render() {
        const {goBack} = this.props.navigation;
        const {curr} = this.state.curr
        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="课程信息"
                    onLeftElementPress={() => goBack()}
                />

                {this.fetchscurr()}
                { curr && [
                    <ListItem
                        divider
                        leftElement={<Text>班级</Text>}
                    />,
                    <ListItem
                        divider
                        leftElement={<Text>课程名称</Text>}
                    />,
                    <ListItem
                        divider
                        leftElement={<Text>签到次数</Text>}
                    />
                ]}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});