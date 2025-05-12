export default class StoryDetailPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStoryDetail(id) {
    try {
      const response = await this.#model.getStoryDetail(id);

      if (response.error) {
        this.#view.showError(response.message);
        return;
      }

      this.#view.showDetail(response.story);
    } catch (error) {
      console.error('loadStoryDetail error:', error);
      this.#view.showError(error.message || 'Terjadi kesalahan saat mengambil detail.');
    }
  }
}
