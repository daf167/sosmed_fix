import {getAllStories} from '../../data/api';
import HomePresenter from './home-presenter';
import L from 'leaflet';

export default class HomePage {
  #presenter;

  async render() {
    return `
      <section class="container" aria-labelledby="story-heading">
        <h1 id="story-heading">Stories</h1>
        <div id="story-list" class="story-list" aria-live="polite">Loading stories...</div>
      </section>

      <section class="container" aria-labelledby="map-heading">
        <h2 id="map-heading">Lokasi Cerita</h2>
        <div id="map" style="height: 400px;" aria-label="Peta lokasi cerita"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      model: getAllStories,
      view: this // passing self as view
    });

    await this.#presenter.showStories();
  }

  showStories(stories) {
    const listContainer = document.getElementById('story-list');
    listContainer.innerHTML = '';

    stories.forEach((story) => {
      const item = document.createElement('article');
      item.classList.add('story-card');
      item.setAttribute('aria-label', `Cerita dari ${story.name}`);
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="story-img" />
        <div class="story-content">
          <h3>${story.name}</h3>
          <p class="story-date">📅 ${new Date(story.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}</p>
          <p class="story-location">📍 ${story.lat && story.lon ? `${story.lat}, ${story.lon}` : 'Lokasi tidak tersedia'}</p>
          <p class="story-description">${story.description.slice(0, 100)}...</p>
          <a href="#/story/${story.id}" class="story-link">Lihat Detail</a>
        </div>
      `;
      listContainer.appendChild(item);
    });
  }

  showError(message) {
    document.getElementById('story-list').innerHTML = `<p role="alert">Error: ${message}</p>`;
  }

  initMap(stories) {
    const map = L.map('map').setView([-2.5, 118], 4); // Fokus Indonesia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });
  }
}
