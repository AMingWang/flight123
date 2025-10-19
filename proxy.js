const fetch = require('node-fetch'); // ⬅️ 必須使用 require 導入

const OPENSKY_API_URL = "https://opensky-network.org/api/states/all?lamin=24.5&lomin=120.5&lamax=26.0&lomax=122.0";

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const response = await fetch(OPENSKY_API_URL);

        if (!response.ok) {
            res.status(response.status).json({ 
                error: 'OpenSky API 服務返回錯誤',
                status: response.status 
            });
            return;
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: '代理伺服器內部錯誤，無法連接 OpenSky。',
            details: error.message 
        });
    }
};
