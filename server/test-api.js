// test-api.js - Простой скрипт для тестирования API
// Запустите: node test-api.js

const API_URL = 'http://localhost:5000/api';
let authToken = '';

// Функция для выполнения запросов
async function makeRequest(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    
    if (!response.ok) {
      console.error(`❌ ${method} ${endpoint}:`, result.error || 'Request failed');
      return null;
    }
    
    console.log(`✅ ${method} ${endpoint}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ ${method} ${endpoint}:`, error.message);
    return null;
  }
}

// Тестовые функции
async function runTests() {
  console.log('🚀 Starting API tests...\n');

  // 1. Регистрация
  console.log('1️⃣ Testing Registration...');
  const registerData = {
    username: `user_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  };
  
  const registerResult = await makeRequest('POST', '/auth/register', registerData);
  if (registerResult) {
    authToken = registerResult.token;
  }

  // 2. Вход
  console.log('\n2️⃣ Testing Login...');
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: registerData.email,
    password: registerData.password
  });
  
  if (loginResult) {
    authToken = loginResult.token;
  }

  // 3. Получить профиль
  console.log('\n3️⃣ Testing Get Profile...');
  await makeRequest('GET', '/auth/me', null, authToken);

  // 4. Создать задачу
  console.log('\n4️⃣ Testing Create Task...');
  const task1 = await makeRequest('POST', '/tasks', {
    title: 'Complete backend development',
    description: 'Finish all API endpoints',
    priority: 'high'
  }, authToken);

  // 5. Создать еще задачи
  console.log('\n5️⃣ Creating more tasks...');
  await makeRequest('POST', '/tasks', {
    title: 'Design frontend',
    description: 'Create React components',
    priority: 'medium'
  }, authToken);

  await makeRequest('POST', '/tasks', {
    title: 'Write documentation',
    description: 'Document all API endpoints',
    priority: 'low'
  }, authToken);

  // 6. Получить все задачи
  console.log('\n6️⃣ Testing Get All Tasks...');
  await makeRequest('GET', '/tasks', null, authToken);

  // 7. Обновить задачу
  if (task1 && task1.task) {
    console.log('\n7️⃣ Testing Update Task...');
    await makeRequest('PUT', `/tasks/${task1.task.id}`, {
      status: 'in_progress'
    }, authToken);
  }

  // 8. Получить статистику
  console.log('\n8️⃣ Testing Get Stats...');
  await makeRequest('GET', '/tasks/stats', null, authToken);

  // 9. Поиск задач
  console.log('\n9️⃣ Testing Search...');
  await makeRequest('GET', '/tasks/search?q=backend', null, authToken);

  // 10. Фильтрация задач
  console.log('\n🔟 Testing Filters...');
  await makeRequest('GET', '/tasks?priority=high', null, authToken);

  console.log('\n✨ Tests completed!');
}

// Запускаем тесты
runTests().catch(console.error);