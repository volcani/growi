import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import AdminUsersContainer from '~/client/services/AdminUsersContainer';
import AppContainer from '~/client/services/AppContainer';
import { toastSuccess, toastError } from '~/client/util/apiNotification';

import { withUnstatedContainers } from '../../UnstatedUtils';

class StatusActivateButton extends React.Component {

  constructor(props) {
    super(props);

    this.onClickAcceptBtn = this.onClickAcceptBtn.bind(this);
  }

  async onClickAcceptBtn() {
    const { t } = this.props;

    try {
      const username = await this.props.adminUsersContainer.activateUser(this.props.user._id);
      toastSuccess(t('toaster.activate_user_success', { username }));
    }
    catch (err) {
      toastError(err);
    }
  }

  render() {
    const { t } = this.props;

    return (
      <button className="dropdown-item" type="button" onClick={() => { this.onClickAcceptBtn() }}>
        <i className="icon-fw icon-user-following"></i> {t('admin:user_management.user_table.accept')}
      </button>
    );
  }

}

const StatusActivateFormWrapperFC = (props) => {
  const { t } = useTranslation();
  return <StatusActivateButton t={t} {...props} />;
};

/**
 * Wrapper component for using unstated
 */
const StatusActivateFormWrapper = withUnstatedContainers(StatusActivateFormWrapperFC, [AppContainer, AdminUsersContainer]);

StatusActivateButton.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminUsersContainer: PropTypes.instanceOf(AdminUsersContainer).isRequired,

  user: PropTypes.object.isRequired,
};

export default StatusActivateFormWrapper;
