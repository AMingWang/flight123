// api/proxy.js (使用 node-fetch 的完整版本)
const fetch = require('node-fetch'); // ⬅️ 關鍵修改：導入 node-fetch

const OPENSKY_API_URL = "https://opensky-network.org/api/states/all?lamin=24.5&lomin=120.5&lamax=26.0&lomax=122.0";

// Vercel Serverless Function 處理函數
module.exports = async (req, res) => {
    // 設置 CORS 標頭，允許來自任何來源的請求（這是解決 CORS 的關鍵）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // 處理瀏覽器發出的 OPTIONS 預檢請求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // 伺服器端發起請求，使用導入的 node-fetch
        const response = await fetch(OPENSKY_API_URL);

        if (!response.ok) {
            // 如果 OpenSky 返回錯誤，將錯誤傳回前端
            res.status(response.status).json({ 
                error: 'OpenSky API 服務返回錯誤',
                status: response.status 
            });
            return;
        }

        // 將 OpenSky 返回的 JSON 數據傳回前端
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
