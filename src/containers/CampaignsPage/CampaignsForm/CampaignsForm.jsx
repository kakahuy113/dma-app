import React, { Component, lazy } from 'react';
import { observer } from 'mobx-react';
import SimpleReactValidator from 'simple-react-validator';

import { FORM_FIELD_TYPE, FORMAT_DATE } from '../../../constants/FormFieldType';
import { CAMPAIGNS_FIELD_KEY } from '../../../constants/CampaignsModule';
import PAGE_STATUS from '../../../constants/PageStatus';
import Spinner from '../../../components/Spinner';

import { renderingGroupFieldHandler } from '../../../utils/form';

const FormComponent = lazy(() => import('../../../components/Form'));

class CampaignsForm extends Component {
  formPropsData = {
    [CAMPAIGNS_FIELD_KEY.PROJECT]: '',
    [CAMPAIGNS_FIELD_KEY.NAME]: '',
    [CAMPAIGNS_FIELD_KEY.START_DATE]: '',
    [CAMPAIGNS_FIELD_KEY.END_DATE]: '',
    [CAMPAIGNS_FIELD_KEY.DATA]: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });

    this.viewModel = this.props.viewModel;
    this.isEditMode = this.viewModel.editMode;
    this.isEditMode = this.viewModel.editMode === true;

    console.log('[CampaignForm] viewModel');
    console.log(this.props.viewModel);

    this.viewModel.setForm(this);
  }

  generateFormSetting = () => {
    console.log('re generate Form Setting', this.formPropsData);
    const dropdownlistProjectValues = this.viewModel.dropdownlistProjectValues
      ? this.viewModel.dropdownlistProjectValues
      : null;

    const projectId = this.formPropsData[CAMPAIGNS_FIELD_KEY.PROJECT] ?? 0;
    const valueProject = dropdownlistProjectValues
      ? dropdownlistProjectValues.find((elm) => parseInt(elm.value) === parseInt(projectId))
      : null;

    return [
      {
        fields: [
          {
            label: 'Project',
            key: CAMPAIGNS_FIELD_KEY.PROJECT,
            type: FORM_FIELD_TYPE.DROPDOWN,
            value: valueProject,
            required: true,
            validation: 'required',
            option: dropdownlistProjectValues,
            changed: (event) => {
              this.formPropsData[CAMPAIGNS_FIELD_KEY.PROJECT] = event.value;
            },
            blurred: () => {
              this.validator.showMessageFor('Project');
            },
          },
          {
            label: 'Campaign Name',
            key: CAMPAIGNS_FIELD_KEY.NAME,
            type: FORM_FIELD_TYPE.INPUT,
            value: this.formPropsData[CAMPAIGNS_FIELD_KEY.NAME],
            required: true,
            validation: 'required',
            changed: (event) => {
              console.log(event.target.value);
              this.formPropsData[CAMPAIGNS_FIELD_KEY.NAME] = event.target.value;
            },
            blurred: () => {
              if (!this.viewModel.editMode) {
                this.validator.showMessageFor('Campaign Name');
              }
            },
          },
          {
            type: FORM_FIELD_TYPE.DATERANGE,
            startField: {
              label: 'Start Date',
              key: CAMPAIGNS_FIELD_KEY.START_DATE,
              value: this.formPropsData[CAMPAIGNS_FIELD_KEY.START_DATE],
              changed: (date) => {
                console.log(date);
                this.formPropsData[CAMPAIGNS_FIELD_KEY.START_DATE] = date;
              },
              required: true,
              validation: 'required',
              blurred: () => {
                this.validator.showMessageFor('Start Date');
              },
            },
            endField: {
              label: 'End Date',
              key: CAMPAIGNS_FIELD_KEY.END_DATE,
              value: this.formPropsData[CAMPAIGNS_FIELD_KEY.END_DATE],
              changed: (date) => {
                this.formPropsData[CAMPAIGNS_FIELD_KEY.END_DATE] = date;
              },
            },
          },

          {
            label: 'Budget',
            key: `${CAMPAIGNS_FIELD_KEY.DATA}`,
            type: FORM_FIELD_TYPE.PRICE,
            value: this.formPropsData[CAMPAIGNS_FIELD_KEY.DATA].budget,
            // validation: 'required',
            changed: (data) => {
              this.formPropsData[CAMPAIGNS_FIELD_KEY.DATA].budget = data.value;
            },
          },
        ],
      },
    ];
  };

  populatingFormDataHandler = (data) => {
    console.log('populatingFormDataHandler', data);
    console.log(data.getProjectId());

    if (!data) return false;

    this.formPropsData[CAMPAIGNS_FIELD_KEY.PROJECT] = data.getProjectId();
    this.formPropsData[CAMPAIGNS_FIELD_KEY.NAME] = data.getName().value;
    this.formPropsData[CAMPAIGNS_FIELD_KEY.START_DATE] = data.getStartDate().original;
    this.formPropsData[CAMPAIGNS_FIELD_KEY.END_DATE] = data.getEndDate().original;
    this.formPropsData[CAMPAIGNS_FIELD_KEY.DATA] = data.getData().value;
  };

  render() {
    const { formStatus, editMode } = this.viewModel;

    if (editMode) {
      let editData = this.viewModel.getCampaignEditData();
      this.populatingFormDataHandler(editData);
    }

    if (formStatus === PAGE_STATUS.LOADING) {
      return <Spinner />;
    }

    console.log('[Campaigns - Form] - re-render .........', this.formPropsData);

    const formSetting = this.generateFormSetting();

    return (
      <>
        {Object.keys(formSetting)
          .map((groupIndex) => {
            return [...Array(formSetting[groupIndex])].map((group) => {
              return renderingGroupFieldHandler(group, this.props.validator);
            });
          })
          .reduce((arr, el) => {
            return arr.concat(el);
          }, [])}
      </>
    );
  }
}

export default CampaignsForm;