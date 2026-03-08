import joblib
import pandas as pd

# Load model yang sudah ditraining
model = joblib.load('../ml/model/model_random_forest.pkl')
print("✅ Model berhasil dimuat!")

# Masukkan data cuaca kemarin untuk prediksi hari ini
data = {
    'TN': [24],      # Suhu minimum hari ini
    'TX': [31.9],      # Suhu maksimum hari ini
    'TAVG': [27.6],    # Suhu rata-rata hari ini
    'RH_AVG': [76],  # Kelembaban rata-rata (%)
    'RR': [1.3],       # Curah hujan (mm) — isi 0 kalau tidak hujan
    'SS': [6.7],       # Lama sinar matahari (jam)
    'FF_AVG': [3]    # Kecepatan angin (m/s)
}

df = pd.DataFrame(data)
hasil = model.predict(df)
print(f"🌤️ Prediksi cuaca hari ini: {hasil[0]}")