import LoginPresenter from './login-presenter';
import LoginModel from '../../data/login-model';

class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter({
      view: this,
      model: new LoginModel(),
    });
  }

  renderInitial() {
    return `
      <section class="form-section">
        <h2>Login</h2>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" required />

          <button type="submit">Login</button>
        </form>
        <div id="register-link">
          <p>Belum punya akun? <a href="#/register">Register di sini</a></p>
        </div>
        <div id="login-result"></div>
      </section>
    `;
  }

  async render() {
    return this.renderInitial();
  }

  async afterRender() {
    const form = document.querySelector('#login-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      this.presenter.handleLogin(email, password);
    });
  }

  showResult(message) {
    document.getElementById('login-result').textContent = message;
  }

  redirectToHome(token) {
    localStorage.setItem('token', token);
    location.replace('#/');
  }
}

export default LoginPage;
