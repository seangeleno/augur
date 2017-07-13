import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import App from 'modules/app/components/app';

import { selectNotificationsAndSeenCount } from 'modules/notifications/selectors/notifications';
import { selectMarketsHeader } from 'modules/markets/selectors/markets-header';
import { selectTags } from 'modules/markets/selectors/tags';
import { selectCoreStats } from 'modules/account/selectors/core-stats';
import portfolio from 'modules/portfolio/selectors/portfolio';
import { updateIsMobile } from 'modules/app/actions/update-is-mobile';
import { updateHeaderHeight } from 'modules/app/actions/update-header-height';
import { updateFooterHeight } from 'modules/app/actions/update-footer-height';
import getChatMessages from 'modules/chat/selectors/chat-messages';
import links from 'modules/link/selectors/links';

import pathToArray from 'modules/app/helpers/path-to-array';
import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  url: state.url,
  loginAccount: state.loginAccount,
  marketsHeader: selectMarketsHeader(state),
  portfolio: portfolio(),
  links: links(),
  notifications: selectNotificationsAndSeenCount(state),
  tags: selectTags(state),
  coreStats: selectCoreStats(state),
  isLogged: !!getValue(state, 'loginAccount.address'),
  isMobile: state.isMobile,
  headerHeight: state.headerHeight,
  footerHeight: state.footerHeight,
  chat: getChatMessages(),
  currentPath: pathToArray(getValue(state, 'router.location.pathname'))
});

const mapDispatchToProps = dispatch => ({
  updateIsMobile: isMobile => dispatch(updateIsMobile(isMobile)),
  updateHeaderHeight: headerHeight => dispatch(updateHeaderHeight(headerHeight)),
  updateFooterHeight: footerHeight => dispatch(updateFooterHeight(footerHeight))
});

const AppContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default AppContainer;
