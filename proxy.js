// api/proxy.js (Vercel Serverless Function)

// 導入 Node.js 內建的 fetch 函式 (Vercel 環境中可用)
// 如果使用 Node.js 18 之前的版本或其他環境，可能需要安裝 node-fetch
const fetch = require('node-fetch');

// OpenSky API URL (臺灣北部邊界)
const OPENSKY_API_URL = "https://opensky-network.org/api/states/all?lamin=24.5&lomin=120.5&lamax=26.0&lomax=122.0";

// 處理所有來自前端的請求 (GET, POST 等)
module.exports = async (req, res) => {
    // 設置 CORS 標頭：允許來自任何來源的請求（解決前端 CORS 問題）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 處理瀏覽器發出的 OPTIONS 預檢請求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        console.log('Proxying request to OpenSky...');

        // 伺服器端發起請求，不受瀏覽器 CORS 限制
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
