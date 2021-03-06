import {createAction} from 'redux-actions';
import {identity} from 'lodash/util';
import * as types from '../action-types';
import {getMenuTreeData} from '../../commons';

export const setSystemMenusStatusByUrl = createAction(types.SET_SYSTEM_MENUS_STATUS_BY_URL, () => {
    return getMenuTreeData() || [];
});

export const setSystemMenuOpenKeys = createAction(types.SET_SYSTEM_MENU_OPEN_KEYS);
export const toggleSideBar = createAction(types.TOGGLE_SIDE_BAR, identity, () => ({sync: 'frame'}));
export const setPageTitle = createAction(types.SET_PAGE_TITLE);
export const setPageBreadcrumbs = createAction(types.SET_PAGE_BREADCRUMBS);
export const hidePageHeader = createAction(types.HIDE_PAGE_HEADER);
export const showPageHeader = createAction(types.SHOW_PAGE_HEADER);
export const hideSideBar = createAction(types.HIDE_SIDE_BAR);
export const showSideBar = createAction(types.SHOW_SIDE_BAR);
export const setSideBarWidth = createAction(types.SET_SIDE_BAR_WIDTH, identity, () => ({sync: 'frame'}));
export const showFullPageLoading = createAction(types.SHOW_FULL_PAGE_LOADING);
export const hideFullPageLoading = createAction(types.HIDE_FULL_PAGE_LOADING);
