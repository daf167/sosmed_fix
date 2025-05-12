export default class HomePresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async showStories() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '/login';
      return;
    }

    try {
      const response = await this.#model(token); // model sebagai fungsi getAllStories
      if (response.error) {
        this.#view.showError(response.message);
        return;
      }

      const stories = response.listStory;
      this.#view.showStories(stories);
      this.#view.initMap(stories); // ⬅️ panggil map dari view
    } catch (error) {
      this.#view.showError(error.message);
    }
  }
}
