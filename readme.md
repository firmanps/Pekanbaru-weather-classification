# 🌤️ Klasifikasi Cuaca Kota Pekanbaru
### Klasifikasi Kondisi Cuaca Harian Menggunakan Random Forest

## 📋 Deskripsi Project

Project ini adalah sistem klasifikasi cuaca Kota Pekanbaru berbasis **Random Forest** dengan arsitektur:
- **Backend**: Flask API untuk endpoint prediksi model
- **Frontend**: Next.js untuk tampilan dashboard cuaca dan form prediksi

Model yang dipakai saat ini adalah `model_random_forest.pkl` (hasil training pada `training_model2.ipynb`) dengan kelas:
- `Cerah`
- `Berawan`
- `Hujan`

## 🗂️ Struktur Folder

```text
weather-classification/
├── backend/
│   ├── api/
│   │   └── app.py
│   └── ml/
│       ├── dataset/
│       ├── img/
│       ├── model/
│       │   └── model_random_forest.pkl
│       └── notebook/
│           └── training_model2.ipynb
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    └── package.json
```

## 🛠️ Teknologi

| Bagian | Teknologi |
|---|---|
| Machine Learning | Python, Scikit-learn (Random Forest) |
| Data Processing | Pandas, NumPy |
| Backend API | Flask, Flask-CORS, joblib |
| Frontend | Next.js 16, React 19, Tailwind CSS, Axios, shadcn/ui |
| Data Cuaca | NASA POWER (training) & OpenWeather API (frontend live data) |

## ⚙️ Menjalankan Project

### 1) Backend

Masuk ke folder backend:

```bash
cd backend
python .\api\app.py
```

Default server berjalan di `http://127.0.0.1:5000` (atau sesuai `FLASK_PORT`).

### 2) Frontend

Masuk ke folder frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend berjalan di `http://localhost:3000`.

## 🔌 Dokumentasi API

### `POST /prediksi`

Mengklasifikasikan cuaca berdasarkan parameter meteorologi.

**Contoh URL:**
`http://127.0.0.1:5002/prediksi`

**Request Body (JSON):**

```json
{
  "TN": 24.5,
  "TX": 32.1,
  "TAVG": 28.0,
  "RH_AVG": 80.0,
  "FF_AVG": 3.2,
  "SOLAR": 5.0,
  "SOLAR_CLEAR": 6.5
}
```

**Keterangan parameter:**

| Parameter | Keterangan | Satuan |
|---|---|---|
| TN | Suhu minimum | °C |
| TX | Suhu maksimum | °C |
| TAVG | Suhu rata-rata | °C |
| RH_AVG | Kelembaban relatif rata-rata | % |
| FF_AVG | Kecepatan angin rata-rata | m/s |
| SOLAR | Radiasi matahari aktual | kWh/m²/hari |
| SOLAR_CLEAR | Radiasi clear sky | kWh/m²/hari |

**Response sukses:**

```json
{
  "status": "success",
  "cuaca": "Berawan",
  "icon": "⛅",
  "pesan": "Klasifikasi cuaca hari ini: Berawan"
}
```

**Response error (contoh validasi):**

```json
{
  "status": "error",
  "message": "semua field wajib diisi",
  "field_kosong": ["SOLAR"]
}
```

## 🤖 Ringkasan Model

- **Algoritma**: Random Forest Classifier
- **Training notebook**: `backend/ml/notebook/training_model2.ipynb`
- **Fitur model (final)**:
  - `TN`, `TX`, `TAVG`, `RH_AVG`, `FF_AVG`, `SOLAR`, `SOLAR_CLEAR`
  - `TEMP_RANGE`, `TEMP_AVG_HUM`, `HUMIDITY_HEAT`, `WIND_TEMP`, `CLEAR_SKY_RATIO`
- **Label**: `Cerah`, `Berawan`, `Hujan`

## 🌐 Catatan Frontend

- Form manual (`prediction-form`) sudah sesuai schema API terbaru (tanpa `RR` dan `SS`).
- Komponen otomatis (`hero` dan `current-weather`) memakai helper prediksi bersama dengan:
  - cache hasil prediksi 1 jam di localStorage
  - dedup request in-flight agar tidak double hit ke `/prediksi` saat mount bersamaan

## 👤 Author

- **Nama**: Firman Parulian Siburian
- **Program Studi**: Teknik Informatika
- **Tahun**: 2026

## 📄 Lisensi

Project ini dibuat untuk keperluan **Tugas Akhir / Skripsi** dan penggunaan akademik.