import StoryDetailPresenter from './story-detail-presenter';
import StoryDetailModel from '../../data/story-detail-model';
import { parseActivePathname } from '../../routes/url-parser';

export default class StoryDetailPage {
  constructor() {
    this.presenter = new StoryDetailPresenter({
      view: this,
      model: new StoryDetailModel(),
    });
  }

  renderInitial() {
    return `
      <section class="container" aria-labelledby="detail-heading">
        <h1 id="detail-heading">Detail Story</h1>
        <div id="story-detail" aria-live="polite">Loading...</div>
        <div id="map" style="height: 400px; margin-top: 20px;" aria-label="Peta lokasi cerita"></div>
      </section>
    `;
  }

  async render() {
    return this.renderInitial();
  }

  async afterRender() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '/login';
      return;
    }

    const { id } = parseActivePathname();
    this.presenter.loadStoryDetail(id);
  }

  showDetail(story) {
    const container = document.getElementById('story-detail');
    container.innerHTML = `
      <img src="${story.photoUrl}" alt="Foto dari ${story.name}" width="300" />
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <p><time datetime="${new Date(story.createdAt).toISOString()}">${new Date(story.createdAt).toLocaleString()}</time></p>
    `;

    if (story.lat && story.lon) {
      this.renderMap(story.lat, story.lon, story.name);
    } else {
      document.getElementById('map').innerHTML = '<p>Lokasi tidak tersedia.</p>';
    }
  }

  renderMap(lat, lon, name) {
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`<b>${name}</b>`)
      .openPopup();
  }

  showError(message) {
    document.getElementById('story-detail').innerHTML = `<p role="alert">Error: ${message}</p>`;
  }
}
