// services/smartService.js - Локальный AI сервис для обработки задач
class SmartService {
  
  // Оценка времени выполнения задачи на основе ключевых слов
  estimateTaskDuration(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    let baseDuration = 30; // Базовое время 30 минут
    
    // Ключевые слова и их влияние на время
    const timeModifiers = {
      'quick': -15,
      'simple': -15,
      'easy': -10,
      'complex': 60,
      'complicated': 60,
      'research': 60,
      'investigate': 45,
      'meeting': 60, // специальный случай - фиксированное время
      'call': 30,
      'email': 15, // специальный случай - фиксированное время
      'review': 45,
      'refactor': 90,
      'implement': 120,
      'design': 90,
      'test': 60,
      'debug': 45,
      'fix': 30
    };
    
    // Специальные случаи (фиксированное время)
    if (text.includes('meeting') || text.includes('call')) {
      baseDuration = 60;
    } else if (text.includes('email') || text.includes('message')) {
      baseDuration = 15;
    } else {
      // Применяем модификаторы
      for (const [keyword, modifier] of Object.entries(timeModifiers)) {
        if (text.includes(keyword)) {
          baseDuration += modifier;
        }
      }
    }
    
    // Минимум 15 минут, округление до 15
    baseDuration = Math.max(15, baseDuration);
    return Math.round(baseDuration / 15) * 15;
  }
  
  // Определение приоритета задачи
  suggestPriority(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    // Высокий приоритет
    const highPriorityKeywords = [
      'urgent', 'asap', 'critical', 'bug', 'fix', 'error', 'broken',
      'immediately', 'emergency', 'hotfix', 'crash', 'down', 'failing'
    ];
    
    // Низкий приоритет
    const lowPriorityKeywords = [
      'maybe', 'someday', 'later', 'eventually', 'nice to have',
      'optional', 'backlog', 'future', 'consider', 'idea'
    ];
    
    for (const keyword of highPriorityKeywords) {
      if (text.includes(keyword)) {
        return 'high';
      }
    }
    
    for (const keyword of lowPriorityKeywords) {
      if (text.includes(keyword)) {
        return 'low';
      }
    }
    
    return 'medium';
  }
  
  // Категоризация задачи
  categorizeTask(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    const categories = {
      'bug': ['bug', 'error', 'fix', 'broken', 'issue', 'problem', 'crash'],
      'meeting': ['meeting', 'call', 'standup', 'demo', 'presentation', 'discussion'],
      'development': ['implement', 'code', 'develop', 'build', 'create', 'feature', 'function'],
      'design': ['design', 'ui', 'ux', 'mockup', 'wireframe', 'prototype', 'layout'],
      'documentation': ['document', 'readme', 'docs', 'write', 'manual', 'guide'],
      'research': ['research', 'investigate', 'analyze', 'study', 'explore', 'learn'],
      'testing': ['test', 'testing', 'qa', 'verify', 'validate', 'check']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return category;
        }
      }
    }
    
    return 'general';
  }
  
  // Генерация умных тегов
  generateSmartTags(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const tags = new Set();
    
    // Технические теги
    const techKeywords = {
      'frontend': ['frontend', 'ui', 'react', 'vue', 'angular', 'css', 'html', 'javascript'],
      'backend': ['backend', 'api', 'server', 'database', 'node', 'express', 'mongodb'],
      'mobile': ['mobile', 'ios', 'android', 'app', 'react native'],
      'database': ['database', 'db', 'sql', 'mongodb', 'postgres', 'mysql'],
      'security': ['security', 'auth', 'login', 'password', 'token', 'encryption'],
      'performance': ['performance', 'optimize', 'speed', 'slow', 'fast', 'cache'],
      'deployment': ['deploy', 'deployment', 'production', 'staging', 'release']
    };
    
    // Проверяем технические ключевые слова
    for (const [tag, keywords] of Object.entries(techKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          tags.add(tag);
          break;
        }
      }
    }
    
    // Добавляем теги по типу задачи
    if (text.includes('bug') || text.includes('fix') || text.includes('error')) {
      tags.add('bug');
    }
    if (text.includes('feature') || text.includes('new')) {
      tags.add('feature');
    }
    if (text.includes('refactor') || text.includes('cleanup')) {
      tags.add('refactor');
    }
    if (text.includes('urgent') || text.includes('asap')) {
      tags.add('urgent');
    }
    if (text.includes('test') || text.includes('testing')) {
      tags.add('testing');
    }
    
    // Извлекаем важные слова (длиннее 3 символов, не стоп-слова)
    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'but', 'words', 'not', 'what', 'some', 'time', 'very', 'when', 'come', 'may', 'say', 'each', 'which', 'she', 'how', 'its', 'two', 'more', 'these', 'want', 'way', 'look', 'first', 'also', 'new', 'because', 'day', 'use', 'man', 'here', 'old', 'see', 'him', 'has', 'been'
    ]);
    
    const words = text.split(/\s+/).filter(word => 
      word.length > 3 && 
      !stopWords.has(word) && 
      /^[a-z]+$/.test(word)
    );
    
    // Добавляем наиболее важные слова как теги
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);
    
    sortedWords.forEach(word => tags.add(word));
    
    // Ограничиваем количество тегов до 5
    return Array.from(tags).slice(0, 5);
  }
}

// Экспортируем как singleton
module.exports = new SmartService(); 