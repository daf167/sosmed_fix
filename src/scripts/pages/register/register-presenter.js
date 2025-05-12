export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async handleRegister({ name, email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.register({ name, email, password });

      if (!response?.message) {
        this.#view.registerFailed('Terjadi kesalahan saat mendaftar.');
        return;
      }

      this.#view.registerSuccess(response.message);
    } catch (error) {
      console.error('handleRegister: error', error);
      this.#view.registerFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
