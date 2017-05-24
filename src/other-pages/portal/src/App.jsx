import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {message} from 'antd';
import {
    isDev,
    configureStore,
    Router,
    initRouter,
    initActions,
    initReducers,
    promiseAjax,
    PubSubMsg,
} from 'zk-react';
import {init as initStorage} from 'zk-react/utils/storage';
import './global.less';
import handleErrorMessage from './commons/handle-error-message';
import actions from './redux/actions';
import reducers from './redux/reducers';
import * as Error404 from './pages/error/Error404';
import * as Frame from './frame/Frame';
import * as Home from './pages/home/Home';
import {getCurrentLoginUser, getAjaxBaseUrl, toLogin} from './commons';

if (isDev) {
    require('./mock/index');

    console.log('current mode is debug, mock is started');
}
const currentLoginUser = getCurrentLoginUser();

initStorage({ // 设置存储前缀，用于区分不同用户的数据
    keyPrefix: currentLoginUser && currentLoginUser.id,
});

initRouter({
    Error404,
    Frame,
    Home,
    historyListen: (history) => {
        PubSubMsg.publish('history-change', history);
    },
    onLeave: (/* prevState */) => {
    },
    onEnter: (nextState, replace, callback) => {
        const ignorePath = [
            '/error/401',
            '/error/403',
            '/error/404',
        ];
        const {location} = nextState;
        if (!currentLoginUser) {
            if (ignorePath.indexOf(location.pathname) < 0) {
                toLogin();
            }
        } else {
            callback();
        }
    },
    onRouterDidMount: () => {
    },
});

initActions(actions);
initReducers(reducers);
promiseAjax.init({
    setOptions: (instance) => {
        instance.defaults.baseURL = getAjaxBaseUrl();
        instance.defaults.headers = {
            'auth-token': currentLoginUser && currentLoginUser.authToken,
        };
    },
    onShowErrorTip: (err, errorTip) => {
        if (err.response && err.response.status === 401) {
            return toLogin();
        }
        if (errorTip !== false) {
            handleErrorMessage(err);
        }
    },
    onShowSuccessTip: (response, successTip) => {
        if (successTip !== false) {
            message.success(successTip, 3);
        }
    },
    isMock: (url /* url, data, method, options */) => {
        return url.startsWith('/mock');
    },
});


const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById('main'));
