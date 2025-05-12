export default class AddStoryPresenter {
  #view;
  #postStory;

  constructor({ view, postStory }) {
    this.#view = view;
    this.#postStory = postStory;
  }

  async handleSubmit({ description, photo, lat, lon, token }) {
    if (!photo) {
      this.#view.showMessage('Silakan pilih atau ambil foto terlebih dahulu.');
      return;
    }

    if (!lat || !lon) {
      this.#view.showMessage('Silakan pilih lokasi cerita di peta.');
      return;
    }

    const response = await this.#postStory({ description, photo, lat, lon, token });

    if (!response.error) {
      this.#view.showMessage('Story berhasil ditambahkan!');
      this.#view.redirectHome();
    } else {
      this.#view.showMessage(`Gagal: ${response.message}`);
    }
  }
}
