class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async handleLogin(email, password) {
    try {
      const response = await this.#model.getLogin({ email, password });

      if (response.loginResult?.token) {
        this.#view.showResult('Login berhasil!');
        this.#view.redirectToHome(response.loginResult.token);
      } else {
        this.#view.showResult(response.message || 'Login gagal!');
      }
    } catch (error) {
      console.error('LoginPresenter error:', error);
      this.#view.showResult('Terjadi kesalahan saat login.');
    }
  }
}

export default LoginPresenter;
