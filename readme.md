# 🌤️ Prediksi Cuaca Kota Pekanbaru
### Klasifikasi Kondisi Cuaca Harian Kota Pekanbaru Menggunakan Algoritma Random Forest Berbasis Data BMKG

---

## 📋 Deskripsi Project

Project ini merupakan sistem prediksi kondisi cuaca harian Kota Pekanbaru menggunakan algoritma **Random Forest**. Sistem ini mampu mengklasifikasikan kondisi cuaca menjadi 4 kategori: **Cerah**, **Berawan**, **Hujan Ringan**, dan **Hujan Lebat** berdasarkan data iklim historis dari BMKG.

Project ini terdiri dari dua bagian utama:
- **Backend** — Python Flask sebagai API
- **Frontend** — Next.js sebagai tampilan website

---

## 🗂️ Struktur Folder

```
weather-prediction/
│
│
├── backend/
│   ├── api/
│   │   └── app.py                     # Flask Api 
│   │
│   └──ml/
│       ├── dataset/                   # Dataset BMKG
│       ├── img/                       # Image Confusion Matrix
│       ├── model/                     # Model Random Forest
│       └── notebook/
│           └── training_model.ipynb   # Notebook training model
│
└── frontend/                          # Project Next.js
    ├── app/
    ├── public/
    └── package.json
```

---

## 🛠️ Teknologi yang Digunakan

| Bagian | Teknologi |
|---|---|
| Machine Learning | Python, Scikit-learn (Random Forest) |
| Data Processing | Pandas, NumPy |
| Visualisasi | Matplotlib, Seaborn |
| Backend API | Python Flask, Flask-CORS |
| Frontend | Next.js, Tailwind CSS, Axios |
| Dataset | BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) |

---

## 📦 Instalasi

### Prasyarat
- Python 3.10 / 3.11
- Node.js 18+
- pip

---

## 🔌 Dokumentasi API

### `POST /prediksi`

Memprediksi kondisi cuaca berdasarkan data iklim yang dikirim.

**URL:** `http://127.0.0.1:5000/prediksi`

**Request Body (JSON):**
```json
{
    "TN": 23.5,
    "TX": 33.0,
    "TAVG": 27.5,
    "RH_AVG": 85.0,
    "RR": 0.0,
    "SS": 7.0,
    "FF_AVG": 2.0
}
```

**Keterangan Parameter:**
| Parameter | Keterangan | Satuan |
|---|---|---|
| TN | Suhu minimum | °C |
| TX | Suhu maksimum | °C |
| TAVG | Suhu rata-rata | °C |
| RH_AVG | Kelembaban udara rata-rata | % |
| RR | Curah hujan | mm |
| SS | Lama penyinaran matahari | jam |
| FF_AVG | Kecepatan angin rata-rata | m/s |

**Response Berhasil:**
```json
{
    "status": "success",
    "cuaca": "Cerah",
    "icon": "☀️",
    "pesan": "Prediksi cuaca hari ini: Cerah"
}
```

**Kategori Cuaca:**
| Kondisi | Keterangan |
|---|---|
| ☀️ Cerah | RR = 0 mm dan SS ≥ 6 jam |
| ⛅ Berawan | RR = 0 mm dan SS < 6 jam |
| 🌧️ Hujan Ringan | 0 < RR ≤ 20 mm |
| ⛈️ Hujan Lebat | RR > 20 mm |

---

## 📊 Dataset

- **Sumber:** BMKG (dataonline.bmkg.go.id)
- **Stasiun:** Stasiun Meteorologi Sultan Syarif Kasim II, Pekanbaru
- **Periode:** Maret 2024 – Maret 2026
- **Jumlah Data:** ±729 baris (harian)
- **Missing Value:** Nilai 8888 dan 9999 dihapus saat preprocessing

---

## 🤖 Model Machine Learning

- **Algoritma:** Random Forest Classifier
- **Parameter:**
  - n_estimators: 100
  - max_depth: 10
  - min_samples_split: 5
  - min_samples_leaf: 3
- **Split Data:** 80% Training / 20% Testing
- **Fitur:** TN, TX, TAVG, RH_AVG, RR, SS, FF_AVG
- **Label:** Cerah, Berawan, Hujan Ringan, Hujan Lebat

---

## 👤 Author

**Nama:** [Firman Parulian Siburian]  
**Program Studi:** [Teknik Informatika]  
**Tahun:** 2026

---

## 📄 Lisensi

Project ini dibuat untuk keperluan **Tugas Akhir / Skripsi**.  
Data bersumber dari BMKG dan digunakan untuk keperluan akademik.