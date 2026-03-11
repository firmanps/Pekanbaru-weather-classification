from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

load_dotenv()
app = Flask(__name__)
CORS(app)

# Load model saat server nyala
model_path = os.path.join(os.path.dirname(__file__), '../ml/model/model_random_forest.pkl')
print(f"Loading model dari: {model_path}")
model = joblib.load(model_path)
print("✅ Model berhasil dimuat!")


@app.route('/prediksi', methods=['POST'])
def prediksi():
    try:
        data = request.get_json()

        # Field yang wajib
        required_fields = ['TN', 'TX', 'TAVG', 'RH_AVG', 'RR', 'SS', 'FF_AVG']

        # Cek field yang kosong / tidak ada
        missing_fields = []
        for field in required_fields:
            if field not in data or data[field] == "" or data[field] is None:
                missing_fields.append(field)

        # Jika ada field kosong
        if len(missing_fields) > 0:
            return jsonify({
                "status": "error",
                "message": "semua field wajib diisi",
                "field_kosong": missing_fields
            }), 400

        # ✅ Validasi wajib angka
        invalid_fields = []
        for field in required_fields:
            nilai = data[field]
            try:
                float(nilai)
            except (ValueError, TypeError):
                invalid_fields.append(field)

        if len(invalid_fields) > 0:
            return jsonify({
                "status": "error",
                "message": "semua field harus berupa angka",
                "field_tidak_valid": invalid_fields
            }), 400

        # Buat dataframe
        df = pd.DataFrame([{
            'TN':     float(data['TN']),
            'TX':     float(data['TX']),
            'TAVG':   float(data['TAVG']),
            'RH_AVG': float(data['RH_AVG']),
            'RR':     float(data['RR']),
            'SS':     float(data['SS']),
            'FF_AVG': float(data['FF_AVG'])
        }])

        # Prediksi
        hasil = model.predict(df)[0]

        # Icon cuaca
        icon_map = {
            'Cerah':        '☀️',
            'Berawan':      '⛅',
            'Hujan Ringan': '🌧️',
            'Hujan Lebat':  '⛈️'
        }

        return jsonify({
            'status': 'success',
            'cuaca': hasil,
            'icon': icon_map.get(hasil, '🌤️'),
            'pesan': f'Prediksi cuaca hari ini: {hasil}'
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'pesan': str(e)
        }), 400


if __name__ == '__main__':
    port_env = int(os.getenv("FLASK_PORT", 5000))
    print(f"🚀 Server Flask berjalan di http://localhost:{port_env}")
    app.run(
        debug=True, 
        host='0.0.0.0', 
        port=port_env
    )