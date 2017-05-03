import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView
} from 'react-native';
import { Toolbar, ListItem,Subheader} from 'react-native-material-ui';
import config from '../config.json'

export class TCurrScreen extends Component {
    state = {
        account: this.props.navigation.state.account,
        curr: []
    }

    fetchcurr = () => {
        console.log('fetching data')
        fetch(`${config.server}/Message`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queryType: '1',
                teacherid: this.state.account
            })
        }).then(res => {
            if(!res.ok) {
                alert('搜索失败，请重试')
                return
            }
            return res.json().then(r => {
                const tmp = [].concat(this.state.curr, r)
                this.setState({curr: tmp})
                }
            )
        }).catch(
            (error) => console.log(error.message)
        )
    }

    componentWillMount() {
        this.fetchcurr()
    }

    render() {
        const {goBack} = this.props.navigation
        const {curr} = this.state
        const data = {curr}
        return (
            <ScrollView style={styles.container}>
                <Toolbar
                    leftElement="arrow-back"
                    centerElement="课程信息"
                    onLeftElementPress={() => goBack()}
                />

                {data.curr.map((v, index) =>
                    <View style={{flex: 1}}>
                        <Subheader
                            text={`${index + 1}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>班级</Text>}
                            centerElement={`${v.class}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>课程名称</Text>}
                            centerElement={`${v.course}`}
                        />
                        <ListItem
                            divider
                            leftElement={<Text>课程代码</Text>}
                            centerElement={`${v.allocationcode}`}
                        />
                    </View>
                    )
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});