from dotenv import load_dotenv
import os

from flask import Flask, request, jsonify
from flask_cors import CORS

import joblib
import numpy as np
import pandas as pd


load_dotenv()

app = Flask(__name__)
CORS(app)


# ============================================================
# LOAD MODEL
# ============================================================

model_path = os.path.join(
    os.path.dirname(__file__),
    '../ml/model/model_cuaca_randomforest.pkl'
)

print(f"Loading model dari: {model_path}")

model = joblib.load(model_path)

print("Model berhasil dimuat!")


# ============================================================
# FITUR YANG DIGUNAKAN MODEL
# ============================================================

FEATURE_COLUMNS = [
    'T2M_MAX',
    'T2M_MIN',
    'T2M',
    'RH2M',
    'WS2M',
    'Cloud_Cover',
    'ALLSKY_SFC_SW_DWN',
    'QV2M'
]


# ============================================================
# LABEL MODEL
# ============================================================

LABEL_MAP = {
    0: 'Cerah',
    1: 'Berawan',
    2: 'Hujan Ringan',
    3: 'Hujan Lebat',
}


# ============================================================
# ICON CUACA
# ============================================================

ICON_MAP = {
    'Cerah': '☀️',
    'Berawan': '⛅',
    'Hujan Ringan': '🌦️',
    'Hujan Lebat': '🌧️',
}


# ============================================================
# MENGHITUNG CLOUD COVER
# ============================================================

def compute_cloud_cover(allsky_sw, clrsky_sw):
    """
    Menghitung Cloud_Cover berdasarkan:
    Cloud_Cover = 1 - (ALLSKY_SFC_SW_DWN / CLRSKY_SFC_SW_DWN)

    Nilai dibatasi pada rentang 0 sampai 1.
    """

    if clrsky_sw == 0:
        raise ValueError(
            "CLRSKY_SFC_SW_DWN tidak boleh bernilai 0"
        )

    cloud_cover = 1 - (
        allsky_sw / clrsky_sw
    )

    return float(
        np.clip(cloud_cover, 0, 1)
    )


# ============================================================
# MEMBENTUK FITUR MODEL
# ============================================================

def build_features(data):
    """
    Menggunakan nama parameter yang sama
    dengan dataset NASA POWER.

    Cloud_Cover dihitung oleh sistem.
    """

    t2m_max = float(data['T2M_MAX'])
    t2m_min = float(data['T2M_MIN'])
    t2m = float(data['T2M'])
    rh2m = float(data['RH2M'])
    ws2m = float(data['WS2M'])

    allsky_sw = float(
        data['ALLSKY_SFC_SW_DWN']
    )

    clrsky_sw = float(
        data['CLRSKY_SFC_SW_DWN']
    )

    qv2m = float(data['QV2M'])


    # Hitung Cloud Cover
    cloud_cover = compute_cloud_cover(
        allsky_sw,
        clrsky_sw
    )


    # Susun fitur sesuai urutan saat training
    return pd.DataFrame([{
        'T2M_MAX': t2m_max,
        'T2M_MIN': t2m_min,
        'T2M': t2m,
        'RH2M': rh2m,
        'WS2M': ws2m,
        'Cloud_Cover': cloud_cover,
        'ALLSKY_SFC_SW_DWN': allsky_sw,
        'QV2M': qv2m,
    }])[FEATURE_COLUMNS]


# ============================================================
# ROUTE PREDIKSI
# ============================================================

@app.route('/prediksi', methods=['POST'])
def prediksi():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Data JSON tidak ditemukan"
            }), 400


        # ====================================================
        # FIELD YANG WAJIB DIKIRIM
        # ====================================================

        required_fields = [
            'T2M_MAX',
            'T2M_MIN',
            'T2M',
            'RH2M',
            'WS2M',
            'ALLSKY_SFC_SW_DWN',
            'CLRSKY_SFC_SW_DWN',
            'QV2M'
        ]


        # ====================================================
        # CEK FIELD KOSONG
        # ====================================================

        missing_fields = [
            field
            for field in required_fields
            if field not in data
            or data[field] == ""
            or data[field] is None
        ]


        if missing_fields:

            return jsonify({
                "status": "error",
                "message": "Semua field wajib diisi",
                "field_kosong": missing_fields
            }), 400


        # ====================================================
        # CEK SEMUA INPUT HARUS ANGKA
        # ====================================================

        invalid_fields = []

        for field in required_fields:

            try:
                float(data[field])

            except (ValueError, TypeError):

                invalid_fields.append(field)


        if invalid_fields:

            return jsonify({
                "status": "error",
                "message": "Semua field harus berupa angka",
                "field_tidak_valid": invalid_fields
            }), 400


        # ====================================================
        # CEK CLRSKY TIDAK BOLEH 0
        # ====================================================

        if float(data['CLRSKY_SFC_SW_DWN']) == 0:

            return jsonify({
                "status": "error",
                "message": (
                    "CLRSKY_SFC_SW_DWN "
                    "tidak boleh bernilai 0"
                ),
                "field_tidak_valid": [
                    "CLRSKY_SFC_SW_DWN"
                ]
            }), 400


        # ====================================================
        # MEMBENTUK FITUR
        # ====================================================

        df = build_features(data)


        print("\nData masuk:")
        print(data)

        print("\nFitur yang dikirim ke model:")
        print(df)


        # ====================================================
        # PREDIKSI
        # ====================================================

        pred_label = int(
            model.predict(df)[0]
        )


        # ====================================================
        # PROBABILITAS
        # ====================================================

        probabilities = model.predict_proba(df)[0]


        cuaca = LABEL_MAP[pred_label]


        # Confidence adalah probabilitas
        # dari kelas yang diprediksi
        confidence = float(
            probabilities[pred_label]
        )


        probabilitas = {
            LABEL_MAP[i]: round(
                float(probabilities[i]) * 100,
                2
            )
            for i in range(len(probabilities))
        }


        # ====================================================
        # RESPONSE
        # ====================================================

        return jsonify({

            'status': 'success',

            'cuaca': cuaca,

            'icon': ICON_MAP.get(
                cuaca,
                '🌤️'
            ),

            'confidence': round(
                confidence * 100,
                2
            ),

            'probabilitas': probabilitas,

            'cloud_cover': round(
                float(df['Cloud_Cover'].iloc[0]),
                4
            ),

            'pesan': (
                f'Klasifikasi cuaca hari ini: {cuaca}'
            )
        })


    except Exception as e:

        return jsonify({
            'status': 'error',
            'pesan': str(e)
        }), 400


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == '__main__':

    port_env = int(
        os.getenv(
            "FLASK_PORT",
            5000
        )
    )

    app.run(
        debug=True,
        host='0.0.0.0',
        port=port_env,
        use_reloader=False,
    )