import { runInAction } from 'mobx';

import {
  AesirxProjectApiService,
  AesirxCampaignApiService,
  AesirxPersonaApiService,
  AesirxBillingPlanApiService,
  AUTHORIZATION_KEY,
  Storage,
} from 'aesirx-dma-lib';

class GlobalStore {
  projectMasterData = null;
  campaignMasterData = null;
  personaMasterData = null;
  connectedChannelsMasterData = null;
  memberFeaturesMasterData = null;
  memberId = Storage.getItem(AUTHORIZATION_KEY.MEMBER_ID) ?? 0;
  memberFullName = Storage.getItem(AUTHORIZATION_KEY.MEMBER_FULL_NAME) ?? '';

  async getMemberFeaturesMasterData() {
    const service = new AesirxBillingPlanApiService();
    const respondedData = await service.getFeaturesMember(this.memberId);
    console.log('GlobalStore - getMemberFeaturesMasterData');
    console.log(respondedData);
    this.memberFeaturesMasterData = respondedData;
    return this.memberFeaturesMasterData;
  }

  async getProjectMasterData() {
    const projectApiService = new AesirxProjectApiService();
    const respondedData = await projectApiService.getProjectMasterData();
    console.log('GlobalStore - getProjectMasterData');
    console.log(respondedData);
    this.projectMasterData = respondedData;
    return this.projectMasterData;
  }

  async getConnectedChannelsMasterData() {
    const PersonaApiService = new AesirxPersonaApiService();
    const respondedData = await PersonaApiService.getConnectedChannelByOrganisationId();
    console.log('GlobalStore - getConnectedChannelsMasterData');
    console.log(respondedData);
    this.connectedChannelsMasterData = respondedData;
    return respondedData;
  }

  async getCampaignMasterData() {
    const campaignApiService = new AesirxCampaignApiService();
    const respondedData = await campaignApiService.getCampaignMasterData();
    console.log('GlobalStore - getCampaignMasterData');
    console.log(respondedData);
    this.campaignMasterData = respondedData;
    return respondedData;
  }

  async getPersonaMasterData() {
    const PersonaApiService = new AesirxPersonaApiService();
    const respondedData = await PersonaApiService.searchPersonas();
    console.log('GlobalStore - getPersonaMasterData', respondedData);
    this.personaMasterData = respondedData?.list;
    return this.personaMasterData;
  }

  async getMasterData(args) {
    try {
      const result = {
        projectMasterData: null,
        campaignMasterData: null,
        personaMasterData: null,
        connectedChannelsMasterData: null,
        memberFeaturesMasterData: null,
      };

      // Project Master Data
      const isForProjectMasterData = args.isForProjectMaster ? args.isForProjectMaster : false;
      const isForceProjectMasterData = args.isForceProjectMasterData
        ? args.isForceProjectMasterData
        : false;

      if (isForProjectMasterData === true) {
        let projectMasterData = null;

        if (isForceProjectMasterData) {
          projectMasterData = await this.getProjectMasterData();
          console.log('isForceProjectMasterData');
          console.log(projectMasterData);
        } else {
          projectMasterData = this.projectMasterData
            ? this.projectMasterData
            : await this.getProjectMasterData();
        }

        // const projectMasterData =  await this.getProjectMasterData();
        if (projectMasterData) {
          result.projectMasterData = projectMasterData;
        }
      }

      // Campaign Master Data
      const isForCampaignMasterData = args.isForCampaignMasterData
        ? args.isForCampaignMasterData
        : false;
      const isForceCampaignMasterData = args.isForceCampaignMasterData
        ? args.isForceCampaignMasterData
        : false;

      if (isForCampaignMasterData === true) {
        let campaignMasterData = null;

        if (isForceCampaignMasterData) {
          campaignMasterData = await this.getCampaignMasterData();
        } else {
          campaignMasterData = this.campaignMasterData
            ? this.campaignMasterData
            : await this.getCampaignMasterData();
        }

        if (campaignMasterData) {
          result.campaignMasterData = campaignMasterData;
        }
      }

      // params for Persona
      const isForPersonaMasterData = args.isForPersonaMasterData
        ? args.isForPersonaMasterData
        : false;
      const isForcePersonaMasterData = args.isForcePersonaMasterData
        ? args.isForcePersonaMasterData
        : false;

      if (isForPersonaMasterData === true) {
        let personaMasterData = null;

        if (isForcePersonaMasterData) {
          personaMasterData = await this.getPersonaMasterData();
        } else {
          personaMasterData = this.personaMasterData
            ? this.personaMasterData
            : await this.getPersonaMasterData();
        }

        if (personaMasterData) {
          result.personaMasterData = personaMasterData;
        }
      }

      //Params connect channel
      const isForConnectedChannelsMasterData = args.isForConnectedChannelsMasterData
        ? args.isForConnectedChannelsMasterData
        : false;
      const isForceConnectedChannelsMasterData = args.isForceConnectedChannelsMasterData
        ? args.isForceConnectedChannelsMasterData
        : false;

      if (isForConnectedChannelsMasterData === true) {
        let connectedChannelsMasterData = null;
        if (isForceConnectedChannelsMasterData) {
          connectedChannelsMasterData = await this.getConnectedChannelsMasterData();
        } else {
          connectedChannelsMasterData = this.connectedChannelsMasterData
            ? this.connectedChannelsMasterData
            : await this.getConnectedChannelsMasterData();
        }

        if (connectedChannelsMasterData) {
          result.connectedChannelsMasterData = connectedChannelsMasterData;
        }
      }

      //Params Member Feature
      const isForMemberFeaturesMasterData = args.isForMemberFeaturesMasterData
        ? args.isForMemberFeaturesMasterData
        : false;
      const isForceMemberFeaturesMasterData = args.isForceMemberFeaturesMasterData
        ? args.isForceMemberFeaturesMasterData
        : false;

      if (isForMemberFeaturesMasterData === true) {
        let memberFeaturesMasterData = null;

        if (isForceMemberFeaturesMasterData) {
          memberFeaturesMasterData = await this.getMemberFeaturesMasterData();
        } else {
          memberFeaturesMasterData = this.memberFeaturesMasterData
            ? this.memberFeaturesMasterData
            : await this.getMemberFeaturesMasterData();
        }

        if (memberFeaturesMasterData) {
          result.memberFeaturesMasterData = memberFeaturesMasterData;
        }
      }

      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default GlobalStore;