import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Card, CardBody } from 'reactstrap';

import AdminCustomizeContainer from '~/client/services/AdminCustomizeContainer';
import { toastSuccess, toastError } from '~/client/util/apiNotification';

import { withUnstatedContainers } from '../../UnstatedUtils';
import AdminUpdateButtonRow from '../Common/AdminUpdateButtonRow';
import CustomScriptEditor from '../CustomScriptEditor';

type Props = {
  adminCustomizeContainer: AdminCustomizeContainer
}

const CustomizeScriptSetting = (props: Props): JSX.Element => {

  const { adminCustomizeContainer } = props;
  const { t } = useTranslation();

  const onClickSubmit = useCallback(async() => {
    try {
      await adminCustomizeContainer.updateCustomizeScript();
      toastSuccess(t('toaster.update_successed', { target: t('admin:customize_setting.custom_script') }));
    }
    catch (err) {
      toastError(err);
    }
  }, [t, adminCustomizeContainer]);

  const getExampleCode = useCallback(() => {
    return `console.log($('.main-container'));
    window.addEventListener('load', (event) => {
      console.log('config: ', appContainer.config);
    });
    `;
  }, []);

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <h2 className="admin-setting-header">{t('admin:customize_setting.custom_script')}</h2>
          <Card className="card well">
            <CardBody className="px-0 py-2">
              {t('admin:customize_setting.write_java')}<br />
              {t('admin:customize_setting.reflect_change')}
            </CardBody>
          </Card>

          <div className="form-text text-muted">
            Placeholders:<br />
            (Available after <code>load</code> event)
          </div>
          <table className="table table-borderless table-sm form-text text-muted offset-1 col-11">
            <tbody>
              <tr>
                <th className="text-right"><code>$</code></th>
                <td>jQuery instance</td>
              </tr>
              <tr>
                <th className="text-right"><code>appContainer</code></th>
                <td>GROWI App <a href="https://github.com/jamiebuilds/unstated">unstated container</a></td>
              </tr>
              <tr>
                <th className="text-right"><code>growiRenderer</code></th>
                <td>GROWI Renderer origin instance</td>
              </tr>
              <tr>
                <th className="text-right"><code>growiPlugin</code></th>
                <td>GROWI Plugin Manager instance</td>
              </tr>
              <tr>
                <th className="text-right"><code>Crowi</code></th>
                <td>Crowi legacy instance (jQuery based)</td>
              </tr>
            </tbody>
          </table>

          <div className="form-text text-muted">
            Examples:
            <pre className="hljs"><code>{getExampleCode()}</code></pre>
          </div>

          <div className="form-group">
            <CustomScriptEditor
              value={adminCustomizeContainer.state.currentCustomizeScript || ''}
              onChange={(inputValue) => { adminCustomizeContainer.changeCustomizeScript(inputValue) }}
            />
            <p className="form-text text-muted text-right">
              <i className="fa fa-fw fa-keyboard-o" aria-hidden="true" />
              {t('admin:customize_setting.ctrl_space')}
            </p>
          </div>

          <AdminUpdateButtonRow onClick={onClickSubmit} disabled={adminCustomizeContainer.state.retrieveError != null} />
        </div>
      </div>
    </React.Fragment>
  );

};

const CustomizeScriptSettingWrapper = withUnstatedContainers(CustomizeScriptSetting, [AdminCustomizeContainer]);

export default CustomizeScriptSettingWrapper;
