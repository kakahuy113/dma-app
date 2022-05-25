import { makeAutoObservable } from 'mobx';
import PAGE_STATUS from '../../../constants/PageStatus';
import CampaignsUtils from '../CampaignsUtils/CampaignsUtils';
import { CAMPAIGNS_FIELD_KEY } from '../../../constants/CampaignsModule';
import { notify } from '../../../components/Toast';
import ContentStore from '../../ContentPage/ContentStore/ContentStore';
import Helper from '../../../utils/helper';

class CampaignsListViewModel {
  campaignsStore = null;

  campaigns = null;

  pagination = null;

  tableRowHeader = null;

  dataFilter = null;

  tableStatus = PAGE_STATUS.LOADING;

  campaignsIdsSelected = null;

  contentStore = null;

  subRowDataTable = null;

  pageSize = 5;

  constructor(campaignsStore) {
    makeAutoObservable(this);
    this.campaignsStore = campaignsStore;
    this.contentStore = new ContentStore();
  }

  initializeData = () => {
    this.tableStatus = PAGE_STATUS.LOADING;
    this.campaignsStore.fetchCampaigns(
      this.callbackOnSuccessHandler,
      this.callbackOnErrorHander,
      0,
      this.pageSize
    );
  };

  refreshTableCampaignsList = () => {
    this.tableStatus = PAGE_STATUS.LOADING;
    this.campaignsStore.fetchCampaigns(
      this.callbackOnSuccessHandler,
      this.callbackOnErrorHander,
      0,
      this.pageSize
    );
  };

  deleteCampaigns = () => {
    let getArrayId = this.campaignsIdsSelected;

    if (getArrayId.length > 0) {
      if (Helper.confirmDeleteItem()) {
        this.tableStatus = PAGE_STATUS.LOADING;
        this.campaignsStore.deleteCampaigns(
          this.campaignsIdsSelected,
          this.refreshTableCampaignsList,
          this.callbackOnErrorHander
        );
      }
    } else {
      notify('Please choose an item to delete');
    }
  };

  getPagination = (paginationStep, isList, limit = 5) => {
    console.log('paginationStep', paginationStep);
    this.pageSize = limit;
    this.tableStatus = PAGE_STATUS.LOADING;
    if (this.dataFilter !== null) {
      this.campaignsStore.searchCampaigns(
        this.callbackOnSuccessHandler,
        this.callbackOnErrorHander,
        this.dataFilter,
        paginationStep,
        this.pageSize
      );
    } else {
      this.campaignsStore.fetchCampaigns(
        this.callbackOnSuccessHandler,
        this.callbackOnErrorHander,
        paginationStep,
        this.pageSize
      );
    }
  };

  searchCampaign = (dataFilter, page = 1) => {
    this.dataFilter = dataFilter;
    console.log('dataFilter');
    console.log(dataFilter);
    this.campaignsStore.searchCampaigns(
      this.callbackOnSuccessHandler,
      this.callbackOnErrorHander,
      dataFilter,
      page,
      this.pageSize
    );
  };

  getContentByIdExpanded = async (campaignId) => {
    console.log('campaignIdcampaignId', campaignId);
    return await this.contentStore.getContentsByCampaignIDs(campaignId, 20);
  };

  resetObservableProperties = () => {
    this.campaigns = null;
    this.pagination = null;
    this.tableRowHeader = null;
    this.dataFilter = null;
    this.tableStatus = PAGE_STATUS.LOADING;
    this.campaignsIdsSelected = null;
    this.contentStore = null;
    this.subRowDataTable = null;
    this.pageSize = 5;
  };

  callbackOnErrorHander = (error) => {
    console.log('callbackOnErrorHander');
    console.log(error);
    this.tableStatus = PAGE_STATUS.READY;
    // notify(error.message);
    this.campaigns = null;
  };

  callbackOnSuccessHandler = (campaignsModelData) => {
    console.log('callbackOnSuccessHandler', campaignsModelData);

    if (campaignsModelData) {
      this.tableStatus = PAGE_STATUS.READY;

      const rowDataTransformed = CampaignsUtils.transformCampaignsModelIntoTableDataRow(
        campaignsModelData.list
      );
      console.log('Row Data is Formatted');
      console.log(rowDataTransformed);
      this.campaigns = rowDataTransformed;
      this.pagination = campaignsModelData.pagination;

      console.log('this.pagination this.pagination', this.pagination);
    } else {
      this.tableStatus = PAGE_STATUS.ERROR;
    }
  };
}

export default CampaignsListViewModel;