# 📚 Примеры использования

Полная документация примеров использования каждого snippet в расширении **Extension VS Code**.

---

## 📋 Содержание

1. [Database (de_db)](#database-de_db)
2. [Admin (de_admin)](#admin-de_admin)
3. [Login (de_login)](#login-de_login)
4. [Register (de_reg)](#register-de_reg)
5. [Application (de_app)](#application-de_app)
6. [Request Application (de_req_app)](#request-application-de_req_app)
7. [Интеграция в реальный проект](#интеграция-в-реальный-проект)

---

## Database (de_db)

### Описание

Шаблон для подключения к MySQL базе данных с использованием объектно-ориентированного mysqli.

### Вставка кода

**Префикс:** `de_db`

```php
$conn = new mysqli('localhost', 'user', 'password', 'database');
hui
```

### Полный пример использования

```php
<?php
// Подключение к БД
$conn = new mysqli('localhost', 'root', 'password', 'myapp_db');

// Проверка подключения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";
?>
```

### Кастомизация для вашего проекта

```php
<?php
// Используйте переменные окружения
$conn = new mysqli(
    $_ENV['DB_HOST'] ?? 'localhost',
    $_ENV['DB_USER'] ?? 'root',
    $_ENV['DB_PASS'] ?? '',
    $_ENV['DB_NAME'] ?? 'database'
);

if ($conn->connect_error) {
    error_log("DB Connection Error: " . $conn->connect_error);
    die("Database connection failed");
}

// Установка кодировки
$conn->set_charset("utf8mb4");
?>
```

### Лучшие практики

✅ **Рекомендуется:**

```php
// Используйте переменные окружения
$conn = new mysqli(
    getenv('DB_HOST'),
    getenv('DB_USER'),
    getenv('DB_PASS'),
    getenv('DB_NAME')
);
```

❌ **Избегайте:**

```php
// Hardcoded пароли
$conn = new mysqli('localhost', 'root', 'realpassword123', 'db');
```

---

## Admin (de_admin)

### Описание

Шаблон для реализации административных функций.

### Вставка кода

**Префикс:** `de_admin`

```php
// Admin logic
function adminAction() {
  // TODO: Implement admin logic here
  console.log('Performing admin action');
}

// Example usage
adminAction();
```

### Полный пример использования

```php
<?php
// Проверка прав администратора
function isAdmin($userId) {
    global $conn;
    $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    return $user && $user['role'] === 'admin';
}

// Административное действие
function adminAction($action, $data) {
    if (!isAdmin($_SESSION['user_id'])) {
        return ['success' => false, 'message' => 'Unauthorized'];
    }

    switch ($action) {
        case 'delete_user':
            return deleteUser($data['user_id']);
        case 'create_report':
            return createReport($data);
        default:
            return ['success' => false, 'message' => 'Unknown action'];
    }
}

function deleteUser($userId) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $success = $stmt->execute();
    return ['success' => $success];
}

// Использование
$result = adminAction('delete_user', ['user_id' => 5]);
?>
```

---

## Login (de_login)

### Описание

Шаблон для реализации функции входа пользователя в систему.

### Вставка кода

**Префикс:** `de_login`

```php
// Login logic
function loginUser(username, password) {
  // TODO: Implement login logic here
  console.log(`Logging in user: ${username}`);
}

// Example usage
loginUser('exampleUser', 'examplePassword');
```

### Полный пример использования

```php
<?php
session_start();

function loginUser($email, $password) {
    global $conn;

    // Проверка формата email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'message' => 'Invalid email format'];
    }

    // Поиск пользователя в БД
    $stmt = $conn->prepare("SELECT id, password_hash, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return ['success' => false, 'message' => 'User not found'];
    }

    $user = $result->fetch_assoc();

    // Проверка пароля
    if (!password_verify($password, $user['password_hash'])) {
        return ['success' => false, 'message' => 'Invalid password'];
    }

    // Установка сессии
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['login_time'] = time();

    return ['success' => true, 'message' => 'Login successful'];
}

// Использование
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = loginUser($_POST['email'], $_POST['password']);
    if ($result['success']) {
        header('Location: /dashboard');
        exit;
    }
}
?>
```

### Пример HTML формы

```html
<form method="POST">
  <input type="email" name="email" required placeholder="Email" />
  <input type="password" name="password" required placeholder="Password" />
  <button type="submit">Login</button>
</form>
```

---

## Register (de_reg)

### Описание

Шаблон для реализации функции регистрации нового пользователя.

### Вставка кода

**Префикс:** `de_reg`

```php
// Registration logic
function registerUser(username, password) {
  // TODO: Implement registration logic here
  console.log(`Registering user: ${username}`);
}

// Example usage
registerUser('exampleUser', 'examplePassword');
```

### Полный пример использования

```php
<?php
function registerUser($email, $password, $username) {
    global $conn;

    // Валидация
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'message' => 'Invalid email'];
    }

    if (strlen($password) < 8) {
        return ['success' => false, 'message' => 'Password too short'];
    }

    if (strlen($username) < 3) {
        return ['success' => false, 'message' => 'Username too short'];
    }

    // Проверка существования пользователя
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        return ['success' => false, 'message' => 'User already exists'];
    }

    // Хеширование пароля
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Создание пользователя
    $stmt = $conn->prepare("INSERT INTO users (email, username, password_hash, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $email, $username, $passwordHash);

    if ($stmt->execute()) {
        return ['success' => true, 'message' => 'Registration successful'];
    } else {
        return ['success' => false, 'message' => 'Registration failed'];
    }
}

// Использование
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = registerUser($_POST['email'], $_POST['password'], $_POST['username']);
}
?>
```

---

## Application (de_app)

### Описание

Шаблон для основной логики приложения.

### Вставка кода

**Префикс:** `de_app`

```php
// Application logic
function applicationAction() {
  // TODO: Implement application logic here
  console.log('Performing application action');
}

// Example usage
applicationAction();
```

### Полный пример - простое приложение

```php
<?php
class Application {
    private $conn;
    private $user_id;

    public function __construct($conn, $user_id = null) {
        $this->conn = $conn;
        $this->user_id = $user_id;
    }

    public function applicationAction($action, $params = []) {
        // Проверка аутентификации
        if (!$this->isAuthenticated()) {
            return $this->error('Not authenticated');
        }

        switch ($action) {
            case 'get_profile':
                return $this->getProfile();
            case 'update_profile':
                return $this->updateProfile($params);
            case 'get_data':
                return $this->getData($params);
            default:
                return $this->error('Unknown action');
        }
    }

    private function isAuthenticated() {
        return isset($_SESSION['user_id']);
    }

    private function getProfile() {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param("i", $this->user_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    private function updateProfile($data) {
        $stmt = $this->conn->prepare("UPDATE users SET name = ?, bio = ? WHERE id = ?");
        $stmt->bind_param("ssi", $data['name'], $data['bio'], $this->user_id);
        return ['success' => $stmt->execute()];
    }

    private function getData($params) {
        // Основная логика получения данных
        return ['data' => []];
    }

    private function error($message) {
        return ['success' => false, 'message' => $message];
    }
}

// Использование
$app = new Application($conn, $_SESSION['user_id'] ?? null);
$response = $app->applicationAction('get_profile');
?>
```

---

## Request Application (de_req_app)

### Описание

Шаблон для обработки запросов приложения (REST API, form submissions и т.д.).

### Вставка кода

**Префикс:** `de_req_app`

```php
// Request Application logic
function requestApplication() {
  // TODO: Implement request application logic here
  console.log('Requesting application');
}

// Example usage
requestApplication();
```

### Полный пример - обработчик запросов

```php
<?php
header('Content-Type: application/json');

class RequestHandler {
    private $method;
    private $action;
    private $data;

    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->action = $_GET['action'] ?? null;
        $this->data = $this->parseRequest();
    }

    private function parseRequest() {
        $input = file_get_contents('php://input');
        return json_decode($input, true) ?? $_POST ?? [];
    }

    public function requestApplication() {
        try {
            // CORS проверка
            if (!$this->validateOrigin()) {
                return $this->response(403, 'CORS not allowed');
            }

            // Маршрутизация
            switch ($this->method) {
                case 'GET':
                    return $this->handleGet();
                case 'POST':
                    return $this->handlePost();
                case 'PUT':
                    return $this->handlePut();
                case 'DELETE':
                    return $this->handleDelete();
                default:
                    return $this->response(405, 'Method not allowed');
            }
        } catch (Exception $e) {
            return $this->response(500, $e->getMessage());
        }
    }

    private function handleGet() {
        return $this->response(200, 'Data retrieved', ['action' => $this->action]);
    }

    private function handlePost() {
        return $this->response(201, 'Data created', $this->data);
    }

    private function handlePut() {
        return $this->response(200, 'Data updated', $this->data);
    }

    private function handleDelete() {
        return $this->response(200, 'Data deleted');
    }

    private function validateOrigin() {
        $allowed_origins = ['http://localhost:3000', 'https://example.com'];
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        return in_array($origin, $allowed_origins);
    }

    private function response($code, $message, $data = null) {
        http_response_code($code);
        $response = [
            'success' => $code < 400,
            'message' => $message,
            'code' => $code
        ];
        if ($data !== null) {
            $response['data'] = $data;
        }
        echo json_encode($response);
        exit;
    }
}

// Использование
$handler = new RequestHandler();
$handler->requestApplication();
?>
```

---

## 🔗 Интеграция в реальный проект

### Проектная структура

```
my-php-app/
├── public/
│   ├── index.php              # Главная страница
│   ├── api.php                # API endpoint
│   └── assets/
├── src/
│   ├── classes/
│   │   ├── Database.php       # Класс БД
│   │   ├── User.php           # Класс пользователя
│   │   └── Application.php    # Класс приложения
│   ├── config/
│   │   └── database.php       # Конфигурация БД
│   └── utils/
│       └── functions.php      # Утилиты
├── config/
│   └── .env                   # Переменные окружения
└── README.md
```

### Пример index.php

```php
<?php
session_start();
require_once __DIR__ . '/../src/config/database.php';
require_once __DIR__ . '/../src/classes/User.php';
require_once __DIR__ . '/../src/classes/Application.php';

// Подключение к БД (используя de_db snippet)
$conn = new mysqli(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    $_ENV['DB_NAME']
);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Логика приложения
$app = new Application($conn, $_SESSION['user_id'] ?? null);
$action = $_GET['action'] ?? 'home';
$result = $app->applicationAction($action, $_GET);

echo json_encode($result);
?>
```

---

**Для большей информации смотрите [README.md](README.md) и [FAQ.md](FAQ.md)**
