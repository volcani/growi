import React from 'react';

import { UserPicture } from '@growi/ui';
import PropTypes from 'prop-types';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';

import AdminUserGroupDetailContainer from '~/client/services/AdminUserGroupDetailContainer';
import AppContainer from '~/client/services/AppContainer';
import { toastSuccess, toastError } from '~/client/util/apiNotification';
import Xss from '~/services/xss';

import { withUnstatedContainers } from '../../UnstatedUtils';

class UserGroupUserFormByInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      inputUser: '',
      applicableUsers: [],
      isLoading: false,
      searchError: null,
    };

    this.xss = new Xss();

    this.addUserBySubmit = this.addUserBySubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.renderMenuItemChildren = this.renderMenuItemChildren.bind(this);

    this.searhApplicableUsersDebounce = debounce(1000, this.searhApplicableUsers);
  }

  async addUserBySubmit() {
    const { adminUserGroupDetailContainer } = this.props;
    const { userGroup } = adminUserGroupDetailContainer.state;

    if (this.state.inputUser.length === 0) { return }
    const userName = this.state.inputUser[0].username;

    try {
      await adminUserGroupDetailContainer.addUserByUsername(userName);
      await adminUserGroupDetailContainer.init();
      await adminUserGroupDetailContainer.closeUserGroupUserModal();
      toastSuccess(`Added "${this.xss.process(userName)}" to "${this.xss.process(userGroup.name)}"`);
      this.setState({ inputUser: '' });
    }
    catch (err) {
      toastError(new Error(`Unable to add "${this.xss.process(userName)}" to "${this.xss.process(userGroup.name)}"`));
    }


  }

  validateForm() {
    return this.state.inputUser !== '';
  }

  async searhApplicableUsers() {
    const { adminUserGroupDetailContainer } = this.props;

    try {
      const users = await adminUserGroupDetailContainer.fetchApplicableUsers(this.state.keyword);
      this.setState({ applicableUsers: users, isLoading: false });
    }
    catch (err) {
      toastError(err);
    }
  }

  /**
   * Reflect when forecast is clicked
   * @param {object} inputUser
   */
  handleChange(inputUser) {
    this.setState({ inputUser });
  }

  handleSearch(keyword) {

    if (keyword === '') {
      return;
    }

    this.setState({ keyword, isLoading: true });
    this.searhApplicableUsersDebounce();
  }

  onKeyDown(event) {
    // 13 is Enter key
    if (event.keyCode === 13) {
      this.addUserBySubmit();
    }
  }

  renderMenuItemChildren(option) {
    const { adminUserGroupDetailContainer } = this.props;
    const user = option;
    return (
      <React.Fragment>
        <UserPicture user={user} size="sm" noLink noTooltip />
        <strong className="ml-2">{user.username}</strong>
        {adminUserGroupDetailContainer.state.isAlsoNameSearched && <span className="ml-2">{user.name}</span>}
        {adminUserGroupDetailContainer.state.isAlsoMailSearched && <span className="ml-2">{user.email}</span>}
      </React.Fragment>
    );
  }

  getEmptyLabel() {
    return (this.state.searchError !== null) && 'Error on searching.';
  }

  render() {
    const { t } = this.props;

    const inputProps = { autoComplete: 'off' };

    return (
      <div className="form-group row">
        <div className="col-8 pr-0">
          <AsyncTypeahead
            {...this.props}
            id="name-typeahead-asynctypeahead"
            ref={(c) => { this.typeahead = c }}
            inputProps={inputProps}
            isLoading={this.state.isLoading}
            labelKey={user => `${user.username} ${user.name} ${user.email}`}
            minLength={0}
            options={this.state.applicableUsers} // Search result
            searchText={(this.state.isLoading ? 'Searching...' : this.getEmptyLabel())}
            renderMenuItemChildren={this.renderMenuItemChildren}
            align="left"
            onChange={this.handleChange}
            onSearch={this.handleSearch}
            onKeyDown={this.onKeyDown}
            caseSensitive={false}
            clearButton
          />
        </div>
        <div className="col-2 pl-0">
          <button
            type="button"
            className="btn btn-success"
            disabled={!this.validateForm()}
            onClick={this.addUserBySubmit}
          >
            {t('add')}
          </button>
        </div>
      </div>
    );
  }

}

UserGroupUserFormByInput.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminUserGroupDetailContainer: PropTypes.instanceOf(AdminUserGroupDetailContainer).isRequired,
};

const UserGroupUserFormByInputWrapperFC = (props) => {
  const { t } = useTranslation();
  return <UserGroupUserFormByInput t={t} {...props} />;
};

/**
 * Wrapper component for using unstated
 */
const UserGroupUserFormByInputWrapper = withUnstatedContainers(UserGroupUserFormByInputWrapperFC, [AppContainer, AdminUserGroupDetailContainer]);

export default UserGroupUserFormByInputWrapper;
