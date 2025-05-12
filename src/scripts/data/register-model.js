import { register } from './api';

export default class RegisterModel {
  async register({ name, email, password }) {
    return await register({ name, email, password });
  }
}
