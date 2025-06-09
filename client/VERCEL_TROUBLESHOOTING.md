# 🚨 Vercel Deployment Troubleshooting

## Проблема: Frontend routes не работают (404 на /auth/register)

### Причина:
Vercel пытается найти файл `/auth/register` вместо того, чтобы перенаправить на React Router.

### ✅ Решение:

#### 1. Проверить vercel.json
Файл должен содержать:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### 2. Проверить REACT_APP_API_URL в Vercel
В настройках Vercel → Environment Variables:
```env
REACT_APP_API_URL=https://task-management-system-4q03.onrender.com/api
```

#### 3. Проверить axios.js
```javascript
const getBaseURL = () => {
  return process.env.REACT_APP_API_URL || 'https://task-management-system-4q03.onrender.com/api';
};
```

#### 4. Очистить кэш и пересобрать
```bash
# В Vercel dashboard
1. Settings → Functions
2. Clear Cache
3. Redeploy

# Локально
npm run build
```

## Проблема: CORS ошибки

### ✅ Решение:
Backend должен содержать в CORS настройках:
```javascript
origin: [
  'https://your-app.vercel.app',
  /^https:\/\/.*\.vercel\.app$/
]
```

## Проблема: Environment Variables не применяются

### ✅ Решение:
1. Vercel Dashboard → Settings → Environment Variables
2. Добавить `REACT_APP_API_URL`
3. Redeploy из Dashboard (не из git push)

## Отладка:

### 1. Проверить что API доступно:
```bash
curl https://task-management-system-4q03.onrender.com/api
```

### 2. Проверить CORS:
```bash
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://task-management-system-4q03.onrender.com/api
```

### 3. Проверить frontend routes:
- Открыть `https://your-app.vercel.app/auth/register` напрямую
- Должен показать React приложение, не 404

### 4. Проверить Network tab в DevTools:
- API запросы должны идти на Render URL
- Не должно быть CORS ошибок 