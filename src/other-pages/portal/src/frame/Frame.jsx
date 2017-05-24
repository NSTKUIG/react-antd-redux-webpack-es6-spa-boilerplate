import React, {Component} from 'react';
import {message} from 'antd';
import {PubSubMsg} from 'zk-react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './style.less';
import handleErrorMessage from '../commons/handle-error-message';
import Header from './Header';
import SideBar from './SideBar';
import PageHeader from './PageHeader';

NProgress.configure({showSpinner: false});

export class LayoutComponent extends Component {
    state = {}

    componentWillMount() {
        const {actions} = this.props;
        actions.setSystemMenusStatusByUrl();
        actions.getStateFromStorage();

        PubSubMsg.subscribe('message', ({type, message: msg, error = {}}) => {
            if (type === 'error') {
                handleErrorMessage(error);
            } else if (type === 'success') {
                message.success(msg, 3);
            } else {
                message.info(msg, 3);
            }
        });

        PubSubMsg.subscribe('history-change', (/* history */) => {
            actions.setSystemMenusStatusByUrl();
        });

        PubSubMsg.subscribe('start-fetching-component', () => {
            NProgress.start();
        });

        PubSubMsg.subscribe('end-fetching-component', () => {
            NProgress.done();
        });
    }

    render() {
        const {sideBarCollapsed, showSideBar, showPageHeader} = this.props;
        let paddingLeft = sideBarCollapsed ? 60 : 200;
        paddingLeft = showSideBar ? paddingLeft : 0;
        const paddingTop = showPageHeader ? 106 : 56;
        return (
            <div className="app-frame">
                <Header/>
                <SideBar/>
                <PageHeader/>
                <div id="frame-content" className="frame-content" style={{paddingLeft, paddingTop}}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.frame,
    };
}
