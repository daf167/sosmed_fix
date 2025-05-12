import { login } from './api';

class LoginModel {
  async getLogin({ email, password }) {
    return await login({ email, password });
  }
}

export default LoginModel;