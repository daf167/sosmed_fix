import RegisterPresenter from './register-presenter';
import RegisterModel from '../../data/register-model';

class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter({
      view: this,
      model: new RegisterModel(),
    });
  }

  renderInitial() {
    return `
      <section class="form-section">
        <h2>Register</h2>
        <form id="register-form">
          <label for="name">Nama</label>
          <input type="text" id="name" name="name" placeholder="Nama" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" required />

          <button type="submit" id="submit-btn">Register</button>
        </form>
        <div id="register-result"></div>
      </section>
    `;
  }

  async render() {
    return this.renderInitial();
  }

  async afterRender() {
    const form = document.querySelector('#register-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      this.presenter.handleRegister({ name, email, password });
    });
  }

  showSubmitLoadingButton() {
    const btn = document.querySelector('#submit-btn');
    btn.disabled = true;
    btn.textContent = 'Mendaftarkan...';
  }

  hideSubmitLoadingButton() {
    const btn = document.querySelector('#submit-btn');
    btn.disabled = false;
    btn.textContent = 'Register';
  }

  registerSuccess(message) {
    this.showResult(message || 'Registrasi berhasil!');
  }

  registerFailed(message) {
    this.showResult(message || 'Registrasi gagal!');
  }

  showResult(message) {
    const result = document.getElementById('register-result');
    if (result) result.textContent = message;
  }
}

export default RegisterPage;
