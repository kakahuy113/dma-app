import { makeAutoObservable, runInAction } from 'mobx';
import { notify } from '../../../components/Toast';
import ProjectUtils from '../../ProjectsPage/ProjectUtils/ProjectUtils';
import ProjectStore from '../../ProjectsPage/ProjectStore/ProjectStore';
import PAGE_STATUS from '../../../constants/PageStatus';
import { CAMPAIGNS_FIELD_KEY } from '../../../constants/CampaignsModule';

class CampaignsFormModalViewModel {
  show = false;
  campaignEditdata = null;
  formStatus = PAGE_STATUS.READY;
  editMode = false;
  campaignsListViewModel = null;

  campaignsStore = null;
  campaignsFormComponent = null;

  dropdownlistProjectValues = null;

  constructor(campaignsStore) {
    makeAutoObservable(this);
    this.campaignsStore = campaignsStore;
  }

  setCampaignsListViewModel = (campaignsListViewModelInstance) => {
    this.campaignsListViewModel = campaignsListViewModelInstance;
  };

  setForm = (campaignsFormComponent) => {
    this.campaignsFormComponent = campaignsFormComponent;
  };

  setEditCampaigns = (data) => {
    console.log('Set edit data for campaign:', data[0]);
    this.editMode = true;

    if (data[0] !== undefined && typeof data == 'object') {
      this.campaignEditdata = data[0];
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  getCampaign = (id) => {
    this.formStatus = PAGE_STATUS.LOADING;
    this.campaignsStore.getCampaign(id, this.setEditCampaigns, this.callbackOnErrorHander);
  };

  initForm = async (id = null) => {
    console.log('Init Campaign Form');

    const projectMasterDataInModel = await this.campaignsStore.getProjectMasterData();

    if (id && id > 0) {
      this.campaignsStore.getCampaign(id, this.setEditCampaigns, this.callbackOnErrorHander);
    }

    runInAction(() => {
      this.dropdownlistProjectValues = projectMasterDataInModel
        ? projectMasterDataInModel.toDropdownListValues()
        : null;
    });

    this.formStatus = PAGE_STATUS.READY;

    // this.campaignsStore.getProjectMasterData((projectMasterDataInModel) => {

    //   if (id && id > 0) {
    //     this.campaignsStore.getCampaign(id, this.setEditCampaigns, this.callbackOnErrorHander);
    //   } else {
    //     this.formStatus = PAGE_STATUS.READY;
    //   }
    // }, this.callbackOnErrorHander);
  };

  loadForm = (id = null) => {
    this.openModal();
    this.formStatus = PAGE_STATUS.LOADING;
    this.initForm(id);
  };

  getCampaignEditData = () => this.campaignEditdata;

  openModal = () => {
    this.show = true;
  };

  closeModal = () => {
    this.editMode = false;
    this.show = false;
  };

  saveOnModal = () => {
    console.log('Campaign saveOnModal debug', this.editMode);

    if (this.editMode) {
      const campaignId = this.campaignEditdata.getId();
      console.log('CAMPAIGN ID NE', campaignId);
      this.campaignsFormComponent.formPropsData.id = campaignId.value;

      let startDateParse = Date.parse(
        this.campaignsFormComponent.formPropsData[CAMPAIGNS_FIELD_KEY.START_DATE]
      );
      let endDateParse = Date.parse(
        this.campaignsFormComponent.formPropsData[CAMPAIGNS_FIELD_KEY.END_DATE]
      );

      if (
        this.campaignsFormComponent.formPropsData[CAMPAIGNS_FIELD_KEY.NAME] === '' ||
        startDateParse >= endDateParse
      ) {
        notify('Something went wrong from Server response');
      }
    }

    this.campaignsStore.saveCampaigns(
      this.campaignsFormComponent.formPropsData,
      this.callbackOnSuccessHandler,
      this.callbackOnErrorHander
    );
  };

  callbackOnErrorHander = (error) => {
    console.log('callbackOnErrorHander');
    console.log(error);
    notify(error.message);
  };

  callbackOnSuccessHandler = () => {
    console.log('callbackOnSuccessHandler');

    this.closeModal();

    this.campaignsListViewModel.refreshTableCampaignsList();
  };
}

export default CampaignsFormModalViewModel;