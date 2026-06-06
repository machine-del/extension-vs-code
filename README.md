# 🚀 Extension VS Code

Мощное расширение для Visual Studio Code, предоставляющее набор готовых code snippets для быстрой разработки PHP приложений. Расширение содержит шаблоны для работы с базами данных, аутентификацией, администрированием и управлением приложениями.

---

## ✨ Возможности

### 📋 Предустановленные Snippets

Расширение содержит **6 основных команд** с автодополнением и быстрой вставкой кода:

| Префикс      | Команда             | Описание                                       |
| ------------ | ------------------- | ---------------------------------------------- |
| `de_db`      | Database            | Базовый шаблон подключения к MySQL базе данных |
| `de_admin`   | Admin               | Логика управления административными функциями  |
| `de_login`   | Login               | Функция для аутентификации пользователя        |
| `de_reg`     | Register            | Функция регистрации нового пользователя        |
| `de_app`     | Application         | Основная логика приложения                     |
| `de_req_app` | Request Application | Обработка запросов приложения                  |

### 🎯 Основные особенности

- ✅ **Автодополнение в редакторе** - предложения появляются при вводе префикса
- ✅ **Быстрая вставка кода** - вставка полного шаблона одной командой
- ✅ **PHP-ориентированный** - все шаблоны оптимизированы для PHP
- ✅ **Модульная архитектура** - легко расширяется и кастомизируется
- ✅ **Lightweight** - минимальное потребление ресурсов

---

## 📦 Установка

### Из маркетплейса VS Code

1. Откройте VS Code
2. Перейдите в **Extensions** (`Ctrl+Shift+X`)
3. Найдите **"Extension VS Code"**
4. Нажмите **Install**

### Локальная установка

```bash
git clone https://github.com/machine-del/extension-vs-code.git
cd extension-vs-code
pnpm install
pnpm run compile
```

Затем загрузите файл `.vsix`:

```bash
code --install-extension extension-vs-code-0.0.1.vsix
```

---

## 🚀 Использование

### Способ 1: Через автодополнение

1. Откройте PHP файл в VS Code
2. Начните вводить один из префиксов (`de_db`, `de_admin` и т.д.)
3. Выберите предложенный snippet из списка автодополнения
4. Шаблон будет автоматически вставлен

### Способ 2: Через командную палитру

1. Нажмите `Ctrl+Shift+P` (или `Cmd+Shift+P` на macOS)
2. Введите номер команды:
   - `1` - Database
   - `2` - Admin
   - `3` - Login
   - `4` - Register
   - `5` - Application
   - `6` - Request Application
3. Нажмите Enter для вставки

### Пример использования

**Вставка Database шаблона:**

```php
$conn = new mysqli('localhost', 'user', 'password', 'database');
hui
```

После вставки вы можете:

- Изменить параметры подключения
- Добавить обработку ошибок
- Интегрировать в ваше приложение

---

## 🏗️ Архитектура

```
extension-vs-code/
├── src/
│   ├── extension.ts              # Главная точка входа расширения
│   ├── middleware/
│   │   └── index.ts              # Регистрация всех модулей
│   ├── modules/
│   │   ├── db.module.ts          # Модуль базы данных
│   │   ├── admin.module.ts       # Модуль администратора
│   │   ├── auth.module.ts        # Модуль аутентификации
│   │   ├── application.module.ts # Модуль приложения
│   │   ├── register.module.ts    # Модуль регистрации
│   │   └── requestApplication.module.ts # Модуль запросов
│   └── data/
│       ├── db/                   # Конфигурация snippets для БД
│       ├── admin/                # Конфигурация snippets для Admin
│       ├── auth/                 # Конфигурация snippets для Auth
│       └── main/                 # Конфигурация snippets для App
├── dist/                         # Скомпилированный код
├── package.json                  # Зависимости и скрипты
└── tsconfig.json                 # Конфигурация TypeScript
```

### 📝 Структура модуля

Каждый модуль содержит:

- **command** - уникальный идентификатор команды
- **prefix** - префикс для автодополнения
- **template** - массив строк кода для вставки
- **handler** - функция, вызываемая при выполнении команды
- **provider** - провайдер автодополнения

---

## 🔧 Требования

| Компонент  | Минимальная версия |
| ---------- | ------------------ |
| VS Code    | 1.120.0 или выше   |
| Node.js    | 18.x или выше      |
| TypeScript | 5.9.x или выше     |

---

## 📋 Разработка

### Подготовка окружения

```bash
# Установка зависимостей
pnpm install

# Type checking
pnpm run check-types

# Linting
pnpm run lint

# Компиляция в режиме разработки
pnpm run compile

# Watch режим (автоматическая пересборка)
pnpm run watch
```

### Добавление нового snippet

1. **Создайте конфигурацию** в `src/data/<category>/index.json`:

```json
{
  "command": "extension-vs-code.mycommand",
  "prefix": "de_mycommand",
  "template": ["// Ваш код здесь", "// Первая строка", "// Вторая строка"]
}
```

2. **Создайте модуль** в `src/modules/mycommand.module.ts`:

```typescript
import data from "../data/<category>/index.json";
import * as vscode from "vscode";

export function MyCommandModule() {
  const command = data.command;
  const handler = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !Array.isArray(data.template)) return;
    editor.insertSnippet(new vscode.SnippetString(data.template.join("\n")));
  };
  // ... остальной код
  return { command, handler, provider };
}
```

3. **Зарегистрируйте модуль** в `src/middleware/index.ts`:

```typescript
import { MyCommandModule } from "../modules/mycommand.module";

export const modules = [
  MyCommandModule,
  // ... другие модули
];
```

4. **Обновите package.json**, добавив команду в `contributes.commands`

---

## 🐛 Решение проблем

### Проблема: Snippet не появляется в автодополнении

**Решение:**

- Убедитесь, что файл имеет расширение `.php`
- Проверьте, что расширение активировано
- Перезагрузите VS Code: `Ctrl+Shift+P` → "Reload Window"

### Проблема: Команда не вставляется

**Решение:**

- Убедитесь, что есть активный редактор с открытым файлом
- Проверьте консоль: `Ctrl+Shift+`J`` для вывода ошибок
- Пересоберите расширение: `pnpm run compile`

### Проблема: При вводе префикса ничего не происходит

**Решение:**

- Убедитесь, что шаблон в JSON является массивом `[]`, а не строкой
- Проверьте, что `prefix` совпадает с вводимым текстом
- Попробуйте перезагрузить окно: `Ctrl+Shift+P` → "Reload Window"

---

## 📝 Лицензия

Это расширение распространяется под лицензией MIT. Свободное использование в коммерческих и личных проектах.

---

## 🤝 Вклад

Мы приветствуем вклад в проект! Пожалуйста:

1. **Fork** репозиторий
2. **Создайте branch** для ваших изменений (`git checkout -b feature/amazing-feature`)
3. **Commit** ваши изменения (`git commit -m 'Add amazing feature'`)
4. **Push** в ваш fork (`git push origin feature/amazing-feature`)
5. **Откройте Pull Request** с описанием изменений

---

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

- **GitHub Issues** - [Создать issue](https://github.com/machine-del/extension-vs-code/issues)
- **Обсуждения** - [GitHub Discussions](https://github.com/machine-del/extension-vs-code/discussions)

---

## 📚 Дополнительные ресурсы

- [VS Code Extension API](https://code.visualstudio.com/api)
- [VS Code Snippets Documentation](https://code.visualstudio.com/docs/editor/userdefinedsnippets)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 📊 История версий

### 0.0.1 (Текущая)

- ✅ Инициальный релиз
- ✅ 6 основных команд для PHP разработки
- ✅ Автодополнение в редакторе
- ✅ Быстрая вставка кода через командную палитру
- ✅ **Fix**: Исправлены template структуры в JSON (строки → массивы)

---

**Made with ❤️ by the Extension VS Code Team**
