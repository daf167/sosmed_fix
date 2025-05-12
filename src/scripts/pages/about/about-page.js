import AboutPresenter from './about-presenter';

export default class AboutPage {
  constructor() {
    this.presenter = new AboutPresenter({ view: this });
  }

  renderInitial() {
    return `
      <section class="container" aria-labelledby="about-heading">
        <h1 id="about-heading">Tentang Aplikasi</h1>
        <p>Aplikasi ini adalah platform berbagi cerita dengan fitur lokasi.</p>
        <p>Anda dapat menambahkan cerita disertai foto dan lokasi geografis. Cerita-cerita ini bisa dilihat secara interaktif di peta.</p>
        <p>Dibuat sebagai bagian dari pembelajaran pemrograman web modern.</p>

        <h2>Pengembang</h2>
        <ul>
          <li>Nama: Muhammad Daffa Khairullah</li>
          <li>Email: daffakhairullah15@gmail.com</li>
          <li>GitHub: <a href="https://github.com/" target="_blank" rel="noopener">daf167</a></li>
        </ul>
      </section>
    `;
  }

  async render() {
    return this.presenter.loadContent();
  }

  async afterRender() {
    // Tidak ada logika dinamis untuk saat ini
  }
}
