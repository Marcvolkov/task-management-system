// controllers/analyticsController.js - Контроллер для аналитики и инсайтов
const Task = require('../models/Task');

// Получить инсайты продуктивности
// GET /api/analytics/insights
const getProductivityInsights = async (req, res) => {
  try {
    // Получаем статистику и все задачи пользователя
    const [stats, allTasks] = await Promise.all([
      Task.getStats(req.user.id),
      Task.findByUserId(req.user.id)
    ]);

    // Вычисляем completionRate
    const totalTasks = stats.total || 0;
    const completedTasks = stats.completed || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Вычисляем tasksPerDay за последние 7 дней
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentTasks = allTasks.filter(task => 
      new Date(task.created_at) >= sevenDaysAgo
    );
    const tasksPerDay = Math.round((recentTasks.length / 7) * 10) / 10;

    // Вычисляем mostProductiveHour
    const completedTasksWithTime = allTasks.filter(task => 
      task.status === 'completed' && task.updated_at
    );
    
    const hourCounts = {};
    completedTasksWithTime.forEach(task => {
      const hour = new Date(task.updated_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostProductiveHour = Object.keys(hourCounts).length > 0 
      ? parseInt(Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b))
      : 9; // default 9 AM

    // Вычисляем currentStreak - дни подряд с выполненными задачами
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) { // проверяем последние 30 дней
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasCompletedTask = allTasks.some(task => {
        if (task.status !== 'completed' || !task.updated_at) return false;
        const taskDate = new Date(task.updated_at);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === checkDate.getTime();
      });
      
      if (hasCompletedTask) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Генерируем рекомендации
    const recommendations = [];
    
    if (completionRate < 30) {
      recommendations.push("Try breaking tasks into smaller pieces");
    }
    
    if (stats.high_priority > 5) {
      recommendations.push("Too many high priority tasks");
    }
    
    if (stats.in_progress > stats.completed) {
      recommendations.push("Focus on completing current tasks");
    }
    
    if (currentStreak === 0) {
      recommendations.push("Start building a daily completion habit");
    }
    
    if (tasksPerDay < 1) {
      recommendations.push("Consider setting daily task goals");
    }

    const insights = {
      completionRate,
      tasksPerDay,
      mostProductiveHour,
      currentStreak,
      recommendations,
      stats // включаем базовую статистику
    };

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Get productivity insights error:', error);
    res.status(500).json({ 
      error: 'Error fetching productivity insights' 
    });
  }
};

module.exports = {
  getProductivityInsights
}; 