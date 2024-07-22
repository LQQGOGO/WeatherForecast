// const API_KEY = 'f5acfe55561e4433b5a99c7de7e51a75';

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//     // 如果请求类型为GET请求，将API密钥添加到URL参数中
//     if (config.method === 'get') {
//         config.params = config.params || {}; // 确保config.params存在
//         config.params.key = API_KEY; // 添加API密钥到请求参数
//     }
//     // 如果请求类型为POST或其他类型，将API密钥添加到请求头中
//     else {
//         config.headers = config.headers || {}; // 确保config.headers存在
//         config.headers['Authorization'] = `Bearer ${API_KEY}`; // 使用Bearer Token
//     }
//     return config;
// }, function (error) {
//     return Promise.reject(error);
// });