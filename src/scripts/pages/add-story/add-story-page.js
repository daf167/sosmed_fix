import AddStoryPresenter from './add-story-presenter';
import { postStory } from '../../data/api';
import L from 'leaflet';

export default class AddStoryPage {
  #presenter;
  #stream = null;
  #map;
  #marker;
  #capturedBlob = null;

  async render() {
    return `
      <section class="form-section" style="max-width: 600px; margin: 2rem auto; padding: 1.5rem; background: #fff; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="text-align: center; margin-bottom: 1.5rem;">Tambah Cerita</h2>
        <form id="add-story-form" style="display: flex; flex-direction: column; gap: 1rem;">
          
          <div>
            <label for="description"><strong>Deskripsi</strong></label>
            <textarea id="description" class="form-control" rows="3" required style="width: 100%; padding: 0.5rem;"></textarea>
          </div>
  
          <div>
            <label for="photo"><strong>Ambil dari Galeri</strong></label>
            <input type="file" id="photo" accept="image/*" style="margin-top: 0.25rem;" />
            <small style="display: block; margin-top: 0.5rem;">Atau gunakan kamera di bawah</small>
          </div>
  
          <div class="camera-container" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <video id="camera" autoplay muted playsinline style="width: 100%; max-width: 100%; border-radius: 8px;"></video>
            <button type="button" id="capture-button" class="btn btn-primary" style="width: 100%;">📸 Ambil dari Kamera</button>
            <canvas id="canvas" style="display: none;"></canvas>
          </div>
  
          <div class="map-container" style="margin-top: 1rem;">
            <label for="mapPicker"><strong>Pilih Lokasi Cerita</strong></label>
            <div id="mapPicker" style="height: 300px; border-radius: 8px; overflow: hidden; margin-top: 0.5rem;"></div>
            <p id="pickedLocation" style="margin-top: 0.5rem; color: #f00;">📍 Belum dipilih</p>
            <input type="hidden" id="lat" />
            <input type="hidden" id="lon" />
          </div>
  
          <div>
            <button type="submit" class="btn btn-primary" style="width: 100%; background-color: #007bff; border: none; padding: 0.75rem; color: white; font-weight: bold; border-radius: 8px;">
              📤 Kirim Cerita
            </button>
          </div>
  
          <div id="form-message" role="alert" aria-live="polite" style="margin-top: 0.5rem; color: red; text-align: center;"></div>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddStoryPresenter({
      view: this,
      postStory,
    });

    this.#initMap();
    await this.#setupCamera();
    this.#initEvents();
  }

  async #setupCamera() {
    try {
      const video = document.querySelector('#camera');
      this.#stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.#stream;
    } catch (err) {
      this.showMessage('Gagal mengakses kamera: ' + err.message);
    }
  }

  #initMap() {
    const mapContainer = document.getElementById('mapPicker');
    if (!mapContainer) return;

    this.#map = L.map(mapContainer).setView([-2.5, 118], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(this.#map);

    this.#map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (this.#marker) {
        this.#marker.setLatLng([lat, lng]);
      } else {
        this.#marker = L.marker([lat, lng]).addTo(this.#map);
      }

      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;
      document.getElementById('pickedLocation').textContent =
        `📍 Lokasi dipilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    });
  }

  #initEvents() {
    const form = document.querySelector('#add-story-form');
    const fileInput = document.querySelector('#photo');
    const video = document.querySelector('#camera');
    const canvas = document.querySelector('#canvas');
    const captureButton = document.querySelector('#capture-button');

    captureButton.addEventListener('click', () => {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        this.#capturedBlob = blob;
        this.showMessage('Foto dari kamera berhasil diambil.');
        fileInput.value = ''; // Reset file input
      }, 'image/jpeg');
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        this.#capturedBlob = null;
        this.showMessage('Foto dari galeri dipilih.');
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const description = document.getElementById('description').value;
      const photo = this.#capturedBlob || fileInput.files[0];
      const lat = document.getElementById('lat').value;
      const lon = document.getElementById('lon').value;
      const token = localStorage.getItem('token');

      this.#presenter.handleSubmit({ description, photo, lat, lon, token });
    });

    window.addEventListener('hashchange', () => this.stopStream());
  }

  showMessage(message) {
    const msgContainer = document.getElementById('form-message');
    if (msgContainer) {
      msgContainer.textContent = message;
    }
  }

  redirectHome() {
    this.stopStream();
    window.location.hash = '/';
  }

  stopStream() {
    if (this.#stream) {
      this.#stream.getTracks().forEach(track => track.stop());
      this.#stream = null;
    }
  }
}
