import { getStoryDetail } from './api';

export default class StoryDetailModel {
  async getStoryDetail(id) {
    return await getStoryDetail(id);
  }
}