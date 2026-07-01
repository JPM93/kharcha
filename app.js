<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow Pro - Smart Task Manager</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <link rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">

    <style>
        :root {
            --primary: #4f46e5;
            --primary-dark: #3730a3;
            --secondary: #0ea5e9;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --dark: #1e293b;
            --light: #f8fafc;
            --sidebar-width: 260px;
            --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
            --card-hover-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #f1f5f9;
            color: #334155;
            min-height: 100vh;
        }

        .auth-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #1a1a2e 100%);
            position: relative;
            overflow: hidden;
        }

        .auth-container::before {
            content: '';
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, transparent 70%);
            top: -200px;
            right: -150px;
            border-radius: 50%;
            animation: float 8s ease-in-out infinite;
        }

        .auth-container::after {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%);
            bottom: -180px;
            left: -120px;
            border-radius: 50%;
            animation: float 10s ease-in-out infinite reverse;
        }

        @keyframes float {

            0%,
            100% {
                transform: translate(0, 0);
            }

            33% {
                transform: translate(40px, -30px);
            }

            66% {
                transform: translate(-20px, 20px);
            }
        }

        .auth-card {
            background: rgba(255, 255, 255, 0.97);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2.5rem;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
            position: relative;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .auth-card .logo {
            font-size: 2.2rem;
            font-weight: 800;
            text-align: center;
            margin-bottom: 0.3rem;
            background: linear-gradient(135deg, #4f46e5, #0ea5e9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -1px;
        }

        .auth-card .logo-icon {
            text-align: center;
            font-size: 2.8rem;
            margin-bottom: 0.5rem;
        }

        .auth-toggle {
            text-align: center;
            margin-top: 1.2rem;
            color: #64748b;
        }

        .auth-toggle a {
            color: #4f46e5;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
        }

        .auth-toggle a:hover {
            text-decoration: underline;
        }

        .app-container {
            display: flex;
            min-height: 100vh;
        }

        .sidebar {
            width: var(--sidebar-width);
            background: #0f172a;
            color: #e2e8f0;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 100;
            transition: var(--transition);
            display: flex;
            flex-direction: column;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
        }

        .sidebar-header {
            padding: 1.5rem 1.2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            text-align: center;
        }

        .sidebar-header h3 {
            font-weight: 700;
            font-size: 1.4rem;
            margin: 0;
            background: linear-gradient(135deg, #818cf8, #38bdf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -1px;
        }

        .sidebar-nav {
            flex: 1;
            padding: 1rem 0.8rem;
        }

        .sidebar-nav .nav-item {
            margin-bottom: 0.25rem;
        }

        .sidebar-nav .nav-link {
            color: #94a3b8;
            padding: 0.7rem 1rem;
            border-radius: 10px;
            transition: var(--transition);
            font-weight: 500;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
        }

        .sidebar-nav .nav-link:hover,
        .sidebar-nav .nav-link.active {
            background: rgba(79, 70, 229, 0.25);
            color: #e2e8f0;
            transform: translateX(3px);
        }

        .sidebar-nav .nav-link i {
            width: 20px;
            text-align: center;
            font-size: 1rem;
        }

        .sidebar-nav .badge-count {
            background: #4f46e5;
            color: #fff;
            font-size: 0.7rem;
            padding: 3px 8px;
            border-radius: 20px;
            margin-left: auto;
            font-weight: 600;
        }

        .sidebar-footer {
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .main-content {
            flex: 1;
            margin-left: var(--sidebar-width);
            padding: 1.5rem 2rem;
            transition: var(--transition);
            min-height: 100vh;
            position: relative;
        }

        .top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.8rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .top-bar h4 {
            font-weight: 700;
            color: #1e293b;
            margin: 0;
            font-size: 1.5rem;
            letter-spacing: -0.5px;
        }

        .user-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #fff;
            padding: 0.5rem 1rem;
            border-radius: 30px;
            box-shadow: var(--card-shadow);
            cursor: pointer;
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5, #0ea5e9);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 700;
            font-size: 0.85rem;
        }

        .card-custom {
            background: #fff;
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: var(--card-shadow);
            transition: var(--transition);
            border: 1px solid #e2e8f0;
            margin-bottom: 1.2rem;
        }

        .card-custom:hover {
            box-shadow: var(--card-hover-shadow);
            transform: translateY(-1px);
        }

        .stat-card {
            background: #fff;
            border-radius: 16px;
            padding: 1.3rem 1.5rem;
            box-shadow: var(--card-shadow);
            border-left: 4px solid var(--primary);
            transition: var(--transition);
            cursor: pointer;
        }

        .stat-card:hover {
            box-shadow: var(--card-hover-shadow);
            transform: translateY(-2px);
        }

        .stat-card.purple {
            border-left-color: #8b5cf6;
        }

        .stat-card.blue {
            border-left-color: #0ea5e9;
        }

        .stat-card.green {
            border-left-color: #10b981;
        }

        .stat-card.orange {
            border-left-color: #f59e0b;
        }

        .stat-card .stat-value {
            font-size: 2rem;
            font-weight: 800;
            color: #1e293b;
            letter-spacing: -1px;
        }

        .stat-card .stat-label {
            color: #64748b;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .priority-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.3px;
        }

        .priority-critical {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }

        .priority-high {
            background: #fff7ed;
            color: #ea580c;
            border: 1px solid #fed7aa;
        }

        .priority-medium {
            background: #fefce8;
            color: #ca8a04;
            border: 1px solid #fef08a;
        }

        .priority-low {
            background: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
        }

        .task-connection-tag {
            display: inline-block;
            background: #eef2ff;
            color: #4f46e5;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 0.73rem;
            font-weight: 500;
            margin: 2px 3px;
        }

        .task-connection-tag.project {
            background: #f0fdf4;
            color: #059669;
        }

        .task-connection-tag.user {
            background: #fefce8;
            color: #b45309;
        }

        .modal-custom .modal-content {
            border-radius: 16px;
            border: none;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }

        .modal-custom .modal-header {
            border-bottom: 1px solid #e2e8f0;
            padding: 1.2rem 1.5rem;
            background: #f8fafc;
            border-radius: 16px 16px 0 0;
        }

        .modal-custom .modal-footer {
            border-top: 1px solid #e2e8f0;
            padding: 1rem 1.5rem;
        }

        .btn-primary-custom {
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            border: none;
            color: #fff;
            padding: 0.6rem 1.4rem;
            border-radius: 10px;
            font-weight: 600;
            transition: var(--transition);
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
        }

        .btn-primary-custom:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
            color: #fff;
        }

        .btn-outline-custom {
            border: 2px solid #e2e8f0;
            background: #fff;
            color: #334155;
            padding: 0.6rem 1.4rem;
            border-radius: 10px;
            font-weight: 600;
            transition: var(--transition);
        }

        .btn-outline-custom:hover {
            border-color: #4f46e5;
            color: #4f46e5;
            background: #f8fafc;
        }

        .eod-report-box {
            background: #1e293b;
            color: #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem;
            font-family: 'SF Mono', 'Consolas', monospace;
            font-size: 0.85rem;
            line-height: 1.7;
            white-space: pre-wrap;
            max-height: 500px;
            overflow-y: auto;
            position: relative;
        }

        .google-drive-btn {
            background: #fff;
            border: 2px solid #e2e8f0;
            padding: 0.7rem 1.3rem;
            border-radius: 10px;
            font-weight: 600;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        .google-drive-btn:hover {
            border-color: #4285f4;
            background: #f8fafc;
            box-shadow: 0 4px 15px rgba(66, 133, 244, 0.15);
        }

        .section-page {
            display: none;
        }

        .section-page.active {
            display: block;
            animation: fadeSlideIn 0.35s ease;
        }

        @keyframes fadeSlideIn {
            from {
                opacity: 0;
                transform: translateY(12px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .task-row {
            transition: var(--transition);
            cursor: pointer;
            border-left: 3px solid transparent;
        }

        .task-row:hover {
            background: #f8fafc;
            border-left-color: #4f46e5;
        }

        .task-row.critical-row {
            border-left-color: #ef4444;
        }

        .task-row.high-row {
            border-left-color: #f97316;
        }

        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #94a3b8;
        }

        .empty-state i {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        .format-toolbar {
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }

        .format-toolbar button {
            font-size: 0.8rem;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background: #f8f9fa;
            cursor: pointer;
            color: #000;
        }

        .format-toolbar button:hover {
            background: #e2e6ea;
        }

        .subtask-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }

        .subtask-item:last-child {
            border-bottom: none;
        }

        .subtask-status-select {
            width: 100px;
            font-size: 0.75rem;
        }

        .audit-log {
            font-size: 0.8rem;
            max-height: 120px;
            overflow-y: auto;
        }

        .audit-entry {
            padding: 4px 0;
            border-bottom: 1px dashed #ddd;
        }

        .fullscreen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .fullscreen-content {
            background: #1e293b;
            color: #e2e8f0;
            border-radius: 12px;
            padding: 2rem;
            max-width: 80%;
            max-height: 80%;
            overflow-y: auto;
            white-space: pre-wrap;
            font-family: monospace;
        }

        @media (max-width:768px) {
            .sidebar {
                width: 0;
                overflow: hidden;
            }

            .sidebar.open {
                width: var(--sidebar-width);
            }

            .main-content {
                margin-left: 0;
            }

            .top-bar {
                flex-direction: column;
                align-items: flex-start;
            }
        }

        #driveStatus {
            font-size: 0.85rem;
            color: #64748b;
            min-height: 20px;
            margin-top: 10px;
        }

        .drive-status-success {
            color: #10b981;
        }

        .drive-status-error {
            color: #ef4444;
        }

        .format-preview-wrap {
            margin-top: 6px;
        }

        .format-preview-label {
            font-size: 0.72rem;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: block;
        }

        .format-preview-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 0.6rem 0.8rem;
            font-size: 0.9rem;
            min-height: 40px;
            white-space: pre-wrap;
            word-break: break-word;
            color: #334155;
        }

        .format-preview-box code {
            background: #e2e8f0;
            padding: 1px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', 'Consolas', monospace;
            font-size: 0.85em;
            color: #be185d;
        }

        .rich-text-content strong {
            font-weight: 700;
        }

        .rich-text-content code {
            background: #e2e8f0;
            padding: 1px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', 'Consolas', monospace;
            font-size: 0.85em;
            color: #be185d;
        }

        .fullscreen-content code {
            background: rgba(255, 255, 255, 0.12);
            color: #7dd3fc;
        }

        /* Session lock overlay */
        .session-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 9998;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .session-overlay.show {
            display: flex;
        }

        .session-box {
            background: #fff;
            border-radius: 16px;
            padding: 2rem 2rem 1.5rem;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
            text-align: center;
            animation: fadeSlideIn 0.3s ease;
        }

        .session-box h4 {
            margin-bottom: 1rem;
            font-weight: 700;
            color: #1e293b;
        }

        .session-box p {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 1.2rem;
        }

        .session-box .form-control {
            margin-bottom: 1rem;
        }

        .session-box .btn-group {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .session-box .btn-logout {
            background: #ef4444;
            color: #fff;
            border: none;
        }

        .session-box .btn-logout:hover {
            background: #dc2626;
        }

        .session-box .btn-unlock {
            background: var(--primary);
            color: #fff;
            border: none;
        }

        .session-box .btn-unlock:hover {
            background: var(--primary-dark);
        }

        .blur-content {
            filter: blur(4px);
            pointer-events: none;
        }
    </style>
</head>

<body>
    <!-- Toast Container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;"></div>

    <!-- AUTH -->
    <div id="authContainer" class="auth-container">
        <div class="auth-card" id="loginCard">
            <div class="logo-icon">⚡</div>
            <div class="logo">TaskFlow Pro</div>
            <p class="text-center text-muted mb-3" style="font-size:0.9rem;">Smart Task Management for IT Teams</p>
            <form id="loginForm" autocomplete="off">
                <div class="mb-3"><label class="form-label fw-semibold">Email</label>
                    <div class="input-group"><span class="input-group-text"><i class="fas fa-envelope"></i></span><input
                            type="email" class="form-control" id="loginEmail" placeholder="your@email.com" required>
                    </div>
                </div>
                <div class="mb-3"><label class="form-label fw-semibold">Password</label>
                    <div class="input-group"><span class="input-group-text"><i class="fas fa-lock"></i></span><input
                            type="password" class="form-control" id="loginPassword" placeholder="••••••••" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary-custom w-100 mt-2"><i
                        class="fas fa-sign-in-alt me-2"></i>Sign In</button>
            </form>
            <p class="auth-toggle mt-3">Don't have an account? <a onclick="showRegister()">Create Account</a></p>
            <p class="text-center mt-2" style="font-size:0.7rem;color:#94a3b8;">🔒 All data stored locally in your
                browser</p>
        </div>
        <div class="auth-card" id="registerCard" style="display:none;">
            <div class="logo-icon">🚀</div>
            <div class="logo">Join TaskFlow</div>
            <p class="text-center text-muted mb-3" style="font-size:0.9rem;">Set up your workspace</p>
            <form id="registerForm" autocomplete="off">
                <div class="mb-3"><label class="form-label fw-semibold">Full Name</label><input type="text"
                        class="form-control" id="regName" placeholder="John Doe" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Email</label><input type="email"
                        class="form-control" id="regEmail" placeholder="your@email.com" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Password</label><input type="password"
                        class="form-control" id="regPassword" placeholder="Min 6 characters" minlength="6" required>
                </div>
                <div class="mb-3"><label class="form-label fw-semibold">Confirm Password</label><input type="password"
                        class="form-control" id="regConfirmPassword" placeholder="Re-enter password" required></div>
                <button type="submit" class="btn btn-primary-custom w-100 mt-2"><i
                        class="fas fa-user-plus me-2"></i>Create Account</button>
            </form>
            <p class="auth-toggle mt-3">Already have an account? <a onclick="showLogin()">Sign In</a></p>
        </div>
    </div>

    <!-- APP -->
    <div id="appContainer" class="app-container" style="display:none;">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h3>⚡ TaskFlow Pro</h3><small style="color:#94a3b8;font-size:0.7rem;">IT Task Manager</small>
            </div>
            <nav class="sidebar-nav">
                <div class="nav-item"><button class="nav-link active" data-page="dashboard"><i
                            class="fas fa-th-large"></i> Dashboard <span class="badge-count"
                            id="dashTaskCount">0</span></button></div>
                <div class="nav-item"><button class="nav-link" data-page="tasks"><i class="fas fa-list-check"></i> All
                        Tasks</button></div>
                <div class="nav-item"><button class="nav-link" data-page="todayTasks"><i
                            class="fas fa-calendar-day"></i> Today's Tasks</button></div>
                <div class="nav-item"><button class="nav-link" data-page="futureTasks"><i
                            class="fas fa-calendar-alt"></i> Future Tasks</button></div>
                <div class="nav-item"><button class="nav-link" data-page="projects"><i class="fas fa-folder-tree"></i>
                        Projects</button></div>
                <div class="nav-item"><button class="nav-link" data-page="team"><i class="fas fa-users"></i> Team
                        Members</button></div>
                <div class="nav-item"><button class="nav-link" data-page="notes"><i class="fas fa-sticky-note"></i>
                        Notes</button></div>
                <div class="nav-item"><button class="nav-link" data-page="eod"><i class="fas fa-clipboard-list"></i> EOD
                        Report</button></div>
                <div class="nav-item"><button class="nav-link" data-page="settings"><i class="fas fa-cog"></i> Settings
                        & Sync</button></div>
            </nav>
            <div class="sidebar-footer"><button class="btn btn-sm w-100"
                    style="background:rgba(239,68,68,0.2);color:#fca5a5;border:none;border-radius:8px;padding:8px;"
                    onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</button></div>
        </aside>

        <main class="main-content" id="mainContent">
            <div class="top-bar">
                <h4 id="pageTitle">📊 Dashboard</h4>
                <div class="d-flex align-items-center gap-3"><span style="font-size:0.85rem;color:#64748b;"
                        id="currentDateDisplay"></span>
                    <div class="user-badge">
                        <div class="user-avatar" id="userAvatarLetter">U</div><span class="fw-semibold"
                            id="userDisplayName">User</span>
                    </div>
                </div>
            </div>

            <!-- Page sections: Dashboard, Tasks, Today, Future, Projects, Team, Notes, EOD, Settings -->
            <div class="section-page active" id="page-dashboard">
                <div class="row g-3 mb-3">
                    <div class="col-md-3 col-sm-6">
                        <div class="stat-card purple">
                            <div class="stat-value" id="statTotalTasks">0</div>
                            <div class="stat-label">Total Tasks</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="stat-card blue">
                            <div class="stat-value" id="statTodayTasks">0</div>
                            <div class="stat-label">Today's Tasks</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="stat-card orange">
                            <div class="stat-value" id="statPendingTasks">0</div>
                            <div class="stat-label">Pending</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="stat-card green">
                            <div class="stat-value" id="statCompletedTasks">0</div>
                            <div class="stat-label">Completed</div>
                        </div>
                    </div>
                </div>
                <div class="card-custom">
                    <h5 class="fw-bold mb-3">📋 Recent Tasks</h5>
                    <div id="recentTasksList" class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Priority</th>
                                    <th>Due</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="recentTasksBody">
                                <tr>
                                    <td colspan="4" class="empty-state">No tasks yet.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="section-page" id="page-tasks">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">📋 All Tasks</h5><button class="btn btn-primary-custom"
                        onclick="openTaskModal()"><i class="fas fa-plus me-2"></i>Add Task</button>
                </div>
                <div class="card-custom">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Priority</th>
                                    <th>Due Date</th>
                                    <th>Connections</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="allTasksBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="section-page" id="page-todayTasks">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">📅 Today's Tasks</h5><button class="btn btn-primary-custom"
                        onclick="openTaskModal('today')"><i class="fas fa-plus me-2"></i>Add Today's Task</button>
                </div>
                <div class="card-custom">
                    <div id="todayTasksList"></div>
                </div>
            </div>
            <div class="section-page" id="page-futureTasks">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">🔮 Future Tasks</h5><button class="btn btn-primary-custom"
                        onclick="openTaskModal('future')"><i class="fas fa-plus me-2"></i>Add Future Task</button>
                </div>
                <div class="card-custom">
                    <div id="futureTasksList"></div>
                </div>
            </div>
            <div class="section-page" id="page-projects">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">📁 Projects</h5><button class="btn btn-primary-custom"
                        onclick="openProjectModal()"><i class="fas fa-plus me-2"></i>Add Project</button>
                </div>
                <div class="row g-3" id="projectsGrid"></div>
            </div>
            <div class="section-page" id="page-team">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">👥 Team Members</h5><button class="btn btn-primary-custom"
                        onclick="openTeamMemberModal()"><i class="fas fa-plus me-2"></i>Add Member</button>
                </div>
                <div class="row g-3" id="teamGrid"></div>
            </div>
            <div class="section-page" id="page-notes">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">📝 Notes</h5><button class="btn btn-primary-custom"
                        onclick="openNoteModal()"><i class="fas fa-plus me-2"></i>Add Note</button>
                </div>
                <div class="row g-3" id="notesGrid"></div>
            </div>
            <div class="section-page" id="page-eod">
                <h5 class="fw-bold mb-3">📧 End of Day Report</h5>
                <div class="card-custom">
                    <div class="d-flex gap-2 mb-3"><button class="btn btn-primary-custom"
                            onclick="generateEODReport()">Generate Today's Report</button><button
                            class="btn btn-outline-custom" onclick="copyEODReport()">Copy to Clipboard</button><button
                            class="btn btn-outline-custom" id="slackCopyBtn">Copy for Slack</button></div>
                    <div class="eod-report-box" id="eodReportContent"><em>Click "Generate Today's Report" to create your
                            EOD summary...</em></div>
                </div>
            </div>
            <div class="section-page" id="page-settings">
                <h5 class="fw-bold mb-3">⚙️ Settings & Data Sync</h5>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="card-custom">
                            <h6><i class="fas fa-download me-2"></i>Export Data (JSON)</h6><button
                                class="btn btn-primary-custom" onclick="exportData()">Export JSON</button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-custom">
                            <h6><i class="fas fa-upload me-2"></i>Import Data (JSON)</h6><input type="file"
                                id="importFileInput" accept=".json" style="display:none;"
                                onchange="importData(event)"><button class="btn btn-outline-custom"
                                onclick="document.getElementById('importFileInput').click()">Import JSON</button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-custom">
                            <h6><i class="fab fa-google-drive me-2"></i>Google Drive Sync</h6>
                            <div class="mb-2"><label class="form-label small">Google OAuth Client ID</label><input
                                    type="text" class="form-control form-control-sm" id="gdriveClientId"
                                    placeholder="Your Client ID"></div>
                            <div class="mb-2"><label class="form-label small">Drive Folder Name</label><input
                                    type="text" class="form-control form-control-sm" id="gdriveFolderName"
                                    placeholder="e.g., TaskFlowBackup"></div>
                            <button class="btn btn-sm btn-primary-custom mb-2" onclick="saveGoogleDriveConfig()">💾 Save
                                Drive Config</button>
                            <div class="d-flex gap-2 flex-wrap">
                                <button class="google-drive-btn" onclick="uploadToGoogleDrive()"><i
                                        class="fab fa-google-drive" style="color:#4285f4;"></i> Backup</button>
                                <button class="google-drive-btn" onclick="listGoogleDriveFiles()">Restore</button>
                            </div>
                            <div id="driveStatus" class="mt-2"></div>
                            <div id="driveFileList" class="mt-3 small"></div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-custom">
                            <h6><i class="fas fa-clock me-2"></i>Session Timeout</h6>
                            <div class="mb-2"><label class="form-label small">Auto-lock after (minutes)</label>
                                <input type="number" class="form-control form-control-sm" id="timeoutMinutes" min="1"
                                    max="60" value="5" onchange="saveTimeoutSetting()">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-custom">
                            <h6><i class="fas fa-trash-alt me-2"></i>Clear All Data</h6><button class="btn btn-danger"
                                onclick="clearAllData()">Clear All My Data</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Session Lock Overlay -->
    <div id="sessionOverlay" class="session-overlay">
        <div class="session-box">
            <h4><i class="fas fa-lock me-2"></i>Session Locked</h4>
            <p>You were inactive for a while. Please enter your password to continue.</p>
            <input type="password" id="sessionPassword" class="form-control" placeholder="Enter your password..."
                onkeydown="if(event.key==='Enter')unlockSession()">
            <div class="btn-group mt-3">
                <button class="btn btn-unlock" onclick="unlockSession()">Unlock</button>
                <button class="btn btn-logout" onclick="sessionLogout()">Logout</button>
            </div>
        </div>
    </div>

    <!-- Modals: Task, Project, Team Member, Note, Fullscreen Note (unchanged) -->
    <div class="modal fade modal-custom" id="taskModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold" id="taskModalTitle">Add Task</h5><button type="button"
                        class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body"><input type="hidden" id="taskEditId"><input type="hidden"
                        id="taskOriginalStatus">
                    <div class="row g-3">
                        <div class="col-md-8"><label class="form-label fw-semibold">Task Title *</label><input
                                type="text" class="form-control" id="taskTitle"></div>
                        <div class="col-md-4"><label class="form-label fw-semibold">Priority</label><select
                                class="form-select" id="taskPriority">
                                <option value="medium">🔵Medium</option>
                                <option value="critical">🔴 Critical</option>
                                <option value="high">🟠 High</option>
                                <option value="low">🟢 Low</option>
                            </select></div>
                        <div class="col-md-12"><label class="form-label fw-semibold">Description</label>
                            <div class="format-toolbar"><button type="button"
                                    onclick="formatText('bold')"><b>B</b></button><button type="button"
                                    onclick="formatText('italic')"><i>I</i></button><button type="button"
                                    onclick="formatText('underline')"><u>U</u></button><button type="button"
                                    onclick="formatText('strikethrough')"><s>S</s></button><button type="button"
                                    onclick="formatText('code')"><i class="fas fa-code"></i></button></div><textarea
                                class="form-control" id="taskDescription" rows="3"
                                oninput="renderTaskDescPreview()"></textarea>
                            <div class="format-preview-wrap"><span class="format-preview-label"><i
                                        class="fas fa-eye me-1"></i>Live Preview</span>
                                <div class="format-preview-box rich-text-content" id="taskDescPreview"><span
                                        class="text-muted">Nothing to preview yet…</span></div>
                            </div>
                        </div>
                        <div class="col-md-4"><label class="form-label fw-semibold">Due Date *</label><input type="date"
                                class="form-control" id="taskDueDate"></div>
                        <div class="col-md-4"><label class="form-label fw-semibold">Status</label><select
                                class="form-select" id="taskStatus" onchange="onStatusChange()">
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="blocked">Blocked</option>
                            </select></div>
                        <div class="col-md-4"><label class="form-label fw-semibold">Is Future Task?</label><select
                                class="form-select" id="taskIsFuture">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select></div>
                        <div class="col-md-6"><label class="form-label fw-semibold">👤 Assign Team Members</label>
                            <div id="taskTeamCheckboxes" class="border rounded p-2"
                                style="max-height:120px;overflow-y:auto;"></div>
                        </div>
                        <div class="col-md-6"><label class="form-label fw-semibold">📁 Link Projects</label>
                            <div id="taskProjectCheckboxes" class="border rounded p-2"
                                style="max-height:120px;overflow-y:auto;"></div>
                        </div>
                        <div class="col-12"><label class="form-label fw-semibold">📝 Subtasks</label>
                            <div class="d-flex gap-2 mb-2"><input type="text" class="form-control" id="newSubtaskInput"
                                    placeholder="Add subtask..."><button type="button"
                                    class="btn btn-sm btn-outline-primary" onclick="addSubtask()">Add</button><button
                                    type="button" class="btn btn-sm btn-outline-info" onclick="useDevTemplate()">🔧 Dev
                                    Template</button></div>
                            <div id="subtasksContainer" class="border rounded p-2"
                                style="max-height:250px;overflow-y:auto;"></div>
                        </div>
                        <div class="col-12" id="statusCommentRow" style="display:none;"><label
                                class="form-label fw-semibold">📝 Status Change Comment</label><input type="text"
                                class="form-control" id="statusChangeComment"></div>
                        <div class="col-12"><label class="form-label fw-semibold">📜 Activity Log</label>
                            <div class="border rounded p-2 audit-log" id="auditLogContainer"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer"><button type="button" class="btn btn-outline-custom"
                        data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary-custom"
                        onclick="saveTask()">💾 Save Task</button></div>
            </div>
        </div>
    </div>
    <div class="modal fade modal-custom" id="projectModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold" id="projectModalTitle">Add Project</h5><button type="button"
                        class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body"><input type="hidden" id="projectEditId">
                    <div class="mb-3"><label class="form-label fw-semibold">Project Name *</label><input type="text"
                            class="form-control" id="projectName"></div>
                    <div class="mb-3"><label class="form-label fw-semibold">Description</label><textarea
                            class="form-control" id="projectDescription" rows="2"></textarea></div>
                    <div class="mb-3"><label class="form-label fw-semibold">Status</label><select class="form-select"
                            id="projectStatus">
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="on-hold">On Hold</option>
                        </select></div>
                </div>
                <div class="modal-footer"><button type="button" class="btn btn-outline-custom"
                        data-bs-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary-custom"
                        onclick="saveProject()">💾 Save Project</button></div>
            </div>
        </div>
    </div>
    <div class="modal fade modal-custom" id="teamMemberModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Add Team Member</h5><button type="button" class="btn-close"
                        data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body"><input type="hidden" id="teamEditId">
                    <div class="mb-3"><label>Name *</label><input type="text" class="form-control" id="teamName"></div>
                    <div class="mb-3"><label>Email</label><input type="email" class="form-control" id="teamEmail"></div>
                    <div class="mb-3"><label>Role</label><input type="text" class="form-control" id="teamRole"></div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline-custom"
                        data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary-custom"
                        onclick="saveTeamMember()">💾 Save</button></div>
            </div>
        </div>
    </div>
    <div class="modal fade modal-custom" id="noteModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Add Note</h5><button type="button" class="btn-close"
                        data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body"><input type="hidden" id="noteEditId">
                    <div class="mb-3"><label>Title</label><input type="text" class="form-control" id="noteTitle"></div>
                    <div class="mb-3"><label>Category</label><select class="form-select" id="noteCategory">
                            <option value="general">General</option>
                            <option value="meeting">Meeting</option>
                            <option value="code">Code</option>
                            <option value="debug">Debug</option>
                            <option value="idea">Idea</option>
                        </select></div>
                    <div class="mb-3"><label>Content</label>
                        <div class="format-toolbar"><button type="button"
                                onclick="formatNoteText('bold')"><b>B</b></button><button type="button"
                                onclick="formatNoteText('italic')"><i>I</i></button><button type="button"
                                onclick="formatNoteText('underline')"><u>U</u></button><button type="button"
                                onclick="formatNoteText('strikethrough')"><s>S</s></button><button type="button"
                                onclick="formatNoteText('code')"><i class="fas fa-code"></i></button></div><textarea
                            class="form-control" id="noteContent" rows="6" placeholder="Write your note..."
                            oninput="renderNotePreview()"></textarea>
                        <div class="format-preview-wrap"><span class="format-preview-label"><i
                                    class="fas fa-eye me-1"></i>Live Preview</span>
                            <div class="format-preview-box rich-text-content" id="notePreview"><span
                                    class="text-muted">Nothing to preview yet…</span></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline-custom"
                        data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary-custom"
                        onclick="saveNote()">💾 Save Note</button></div>
            </div>
        </div>
    </div>
    <div id="noteFullscreenOverlay" class="fullscreen-overlay" style="display:none;" onclick="closeNoteFullscreen()">
        <div class="fullscreen-content" onclick="event.stopPropagation()">
            <div class="d-flex justify-content-between mb-2">
                <h5 id="fullscreenNoteTitle" class="fw-bold text-white mb-0"></h5><button class="btn btn-sm btn-light"
                    onclick="closeNoteFullscreen()">✕ Close</button>
            </div>
            <div id="fullscreenNoteContent" class="rich-text-content"></div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        (function () {
            let currentUser = null, currentPage = 'dashboard';
            const APP_PREFIX = 'taskflow_';
            const LAST_PAGE_KEY = APP_PREFIX + 'last_page';
            const TIMEOUT_KEY = APP_PREFIX + 'timeout_minutes';

            // Session variables
            let sessionTimer, sessionTickTimer;
            let locked = false;

            function showToast(msg, type = 'info') {
                const c = document.querySelector('.toast-container'); if (!c) return;
                const bg = { success: 'bg-success text-white', error: 'bg-danger text-white', info: 'bg-info text-dark', warning: 'bg-warning text-dark' }[type] || 'bg-info text-dark';
                const icon = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' }[type] || 'fa-info-circle';
                const el = document.createElement('div'); el.innerHTML = `<div class="toast align-items-center ${bg} border-0"><div class="d-flex"><div class="toast-body"><i class="fas ${icon} me-2"></i>${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`;
                const n = el.firstChild; c.appendChild(n); const t = new bootstrap.Toast(n, { delay: 3000 }); t.show(); n.addEventListener('hidden.bs.toast', () => n.remove());
            }
            function getStorageKey(k) { return currentUser ? APP_PREFIX + 'user_' + currentUser.id + '_' + k : APP_PREFIX + 'global_' + k; }
            function save(k, v) { try { localStorage.setItem(getStorageKey(k), JSON.stringify(v)); return true; } catch (e) { showToast('Storage full', 'error'); return false; } }
            function load(k, d = null) { const r = localStorage.getItem(getStorageKey(k)); if (r === null) return d; try { return JSON.parse(r); } catch (e) { return d; } }
            function getAllData() { return { tasks: load('tasks', []), projects: load('projects', []), team: load('teamMembers', []), notes: load('notes', []), profile: load('profile', {}) }; }
            function restore(d) { save('tasks', d.tasks || []); save('projects', d.projects || []); save('teamMembers', d.team || []); save('notes', d.notes || []); if (d.profile) save('profile', d.profile); }
            function hash(p) { let h = 0; for (let i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0; } return 'hashed_' + Math.abs(h).toString(36) + '_' + btoa(p).replace(/=/g, ''); }
            function users() { return JSON.parse(localStorage.getItem(APP_PREFIX + 'all_users') || '[]'); }
            function saveUsers(u) { localStorage.setItem(APP_PREFIX + 'all_users', JSON.stringify(u)); }
            function register(n, e, p) {
                const all = users(); if (all.find(u => u.email === e.toLowerCase())) { showToast('Email already exists', 'error'); return false; }
                const nu = { id: 'usr_' + Date.now() + Math.random().toString(36).substr(2, 6), name: n, email: e.toLowerCase(), passwordHash: hash(p), createdAt: new Date().toISOString() };
                all.push(nu); saveUsers(all);
                currentUser = nu; save('profile', { name: n, email: e.toLowerCase() }); save('tasks', []); save('projects', []); save('teamMembers', []); save('notes', []);
                currentUser = null; showToast('Account created! Sign in.', 'success'); return true;
            }
            function login(e, p) {
                const all = users(); const u = all.find(x => x.email === e.toLowerCase());
                if (!u) { showToast('No account found', 'error'); return false; }
                if (u.passwordHash !== hash(p)) { showToast('Incorrect password', 'error'); return false; }
                currentUser = u; localStorage.setItem(APP_PREFIX + 'current_user_id', u.id);
                if (!load('tasks')) save('tasks', []); if (!load('projects')) save('projects', []); if (!load('teamMembers')) save('teamMembers', []); if (!load('notes')) save('notes', []);
                showToast('Welcome, ' + u.name + '!', 'success'); return true;
            }
            function logout() {
                stopSessionTimer();
                if (confirm('Logout?')) {
                    currentUser = null;
                    localStorage.removeItem(APP_PREFIX + 'current_user_id');
                    document.getElementById('appContainer').style.display = 'none';
                    document.getElementById('authContainer').style.display = 'flex';
                    document.getElementById('loginCard').style.display = 'block';
                    document.getElementById('registerCard').style.display = 'none';
                    document.getElementById('loginForm').reset();
                    hideSessionOverlay();
                    showToast('Logged out', 'info');
                }
            }
            window.logout = logout;

            window.showRegister = () => { document.getElementById('loginCard').style.display = 'none'; document.getElementById('registerCard').style.display = 'block'; };
            window.showLogin = () => { document.getElementById('registerCard').style.display = 'none'; document.getElementById('loginCard').style.display = 'block'; };

            // Data accessors
            function getTasks() { return load('tasks', []); }
            function getProjects() { return load('projects', []); }
            function getTeam() { return load('teamMembers', []); }
            function getNotes() { return load('notes', []); }
            function getTask(id) { return getTasks().find(t => t.id === id); }
            function getProject(id) { return getProjects().find(p => p.id === id); }
            function getMember(id) { return getTeam().find(m => m.id === id); }
            function saveTasks(t) { save('tasks', t); }
            function saveProjects(p) { save('projects', p); }
            function saveTeam(m) { save('teamMembers', m); }
            function saveNotes(n) { save('notes', n); }

            // Formatting
            window.formatText = function (cmd) { const ta = document.getElementById('taskDescription'); const s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.substring(s, e); let fmt = '', off = 0; switch (cmd) { case 'bold': fmt = `**${sel}**`; off = 2; break; case 'italic': fmt = `*${sel}*`; off = 1; break; case 'underline': fmt = `__${sel}__`; off = 2; break; case 'strikethrough': fmt = `~~${sel}~~`; off = 2; break; case 'code': fmt = '`' + sel + '`'; off = 1; break; } ta.value = ta.value.substring(0, s) + fmt + ta.value.substring(e); ta.focus(); ta.setSelectionRange(s + off, s + off + sel.length); renderTaskDescPreview(); };
            window.formatNoteText = function (cmd) { const ta = document.getElementById('noteContent'); const s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.substring(s, e); let fmt = '', off = 0; switch (cmd) { case 'bold': fmt = `**${sel}**`; off = 2; break; case 'italic': fmt = `*${sel}*`; off = 1; break; case 'underline': fmt = `__${sel}__`; off = 2; break; case 'strikethrough': fmt = `~~${sel}~~`; off = 2; break; case 'code': fmt = '`' + sel + '`'; off = 1; break; } ta.value = ta.value.substring(0, s) + fmt + ta.value.substring(e); ta.focus(); ta.setSelectionRange(s + off, s + off + sel.length); renderNotePreview(); };
            function parseFormatting(raw) { if (!raw) return ''; let html = escapeHtml(raw); html = html.replace(/`([^`]+?)`/g, '<code>$1</code>'); html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>'); html = html.replace(/__([^_]+?)__/g, '<u>$1</u>'); html = html.replace(/~~([^~]+?)~~/g, '<del>$1</del>'); html = html.replace(/\*([^*]+?)\*/g, '<em>$1</em>'); html = html.replace(/\n/g, '<br>'); return html; }
            window.parseFormatting = parseFormatting;
            function formatPreview(raw, maxLen) { if (!raw) return ''; let text = raw; if (maxLen && text.length > maxLen) text = text.substring(0, maxLen) + '…'; return parseFormatting(text); }
            window.renderTaskDescPreview = function () { const val = document.getElementById('taskDescription').value; const box = document.getElementById('taskDescPreview'); box.innerHTML = val.trim() ? parseFormatting(val) : '<span class="text-muted">Nothing to preview yet…</span>'; };
            window.renderNotePreview = function () { const val = document.getElementById('noteContent').value; const box = document.getElementById('notePreview'); box.innerHTML = val.trim() ? parseFormatting(val) : '<span class="text-muted">Nothing to preview yet…</span>'; };

            let currentSubtasks = [];
            window.addSubtask = function () { const inp = document.getElementById('newSubtaskInput'); const title = inp.value.trim(); if (!title) return; currentSubtasks.push({ id: 'sub_' + Date.now() + Math.random().toString(36).substr(2, 5), title, status: 'pending', createdAt: new Date().toISOString() }); inp.value = ''; renderSubtasks(); };
            window.changeSubtaskStatus = function (id, newStatus) { const sub = currentSubtasks.find(s => s.id === id); if (sub) sub.status = newStatus; renderSubtasks(); };
            window.deleteSubtask = function (id) { currentSubtasks = currentSubtasks.filter(s => s.id !== id); renderSubtasks(); };
            function renderSubtasks() { const c = document.getElementById('subtasksContainer'); if (!currentSubtasks.length) { c.innerHTML = '<small class="text-muted">No subtasks yet.</small>'; return; } c.innerHTML = currentSubtasks.map(s => `<div class="subtask-item"><select class="form-select form-select-sm subtask-status-select" onchange="changeSubtaskStatus('${s.id}', this.value)"><option value="pending" ${s.status === 'pending' ? 'selected' : ''}>Pending</option><option value="in-progress" ${s.status === 'in-progress' ? 'selected' : ''}>In Progress</option><option value="completed" ${s.status === 'completed' ? 'selected' : ''}>Completed</option><option value="blocked" ${s.status === 'blocked' ? 'selected' : ''}>Blocked</option></select><span style="flex:1;">${escapeHtml(s.title)}</span><button type="button" class="btn btn-sm text-danger" onclick="deleteSubtask('${s.id}')"><i class="fas fa-times"></i></button></div>`).join(''); }
            window.useDevTemplate = function () { currentSubtasks = [{ id: 'sub_' + Date.now() + 1, title: '1. Pick module & prepare docs/prompts', status: 'pending', createdAt: new Date().toISOString() }, { id: 'sub_' + Date.now() + 2, title: '2. AI code generation & transfer', status: 'pending', createdAt: new Date().toISOString() }, { id: 'sub_' + Date.now() + 3, title: '3. Code review & customization', status: 'pending', createdAt: new Date().toISOString() }, { id: 'sub_' + Date.now() + 4, title: '4. Testing & commit (module → main)', status: 'pending', createdAt: new Date().toISOString() }]; renderSubtasks(); showToast('Dev template applied', 'success'); };
            let currentAuditLog = [];
            window.onStatusChange = function () { document.getElementById('statusCommentRow').style.display = 'block'; };
            function renderAuditLog() { const c = document.getElementById('auditLogContainer'); if (!currentAuditLog.length) { c.innerHTML = '<small class="text-muted">No activity yet.</small>'; return; } c.innerHTML = currentAuditLog.slice().reverse().map(e => `<div class="audit-entry"><strong>${new Date(e.timestamp).toLocaleString()}</strong>: ${e.oldStatus ? e.oldStatus + ' → ' : ''}<span class="badge bg-secondary">${e.newStatus}</span>${e.comment ? `<br><small>💬 ${escapeHtml(e.comment)}</small>` : ''}</div>`).join(''); }

            window.openTaskModal = function (mode = 'add', taskId = null) {
                currentSubtasks = []; currentAuditLog = [];
                document.getElementById('taskEditId').value = ''; document.getElementById('taskModalTitle').textContent = 'Add New Task';
                document.getElementById('taskTitle').value = ''; document.getElementById('taskDescription').value = '';
                document.getElementById('taskPriority').value = 'medium'; document.getElementById('taskDueDate').value = new Date().toISOString().split('T')[0];
                document.getElementById('taskStatus').value = 'pending'; document.getElementById('taskOriginalStatus').value = 'pending';
                document.getElementById('taskIsFuture').value = 'no'; document.getElementById('statusCommentRow').style.display = 'none';
                populateCheckboxes(); renderSubtasks(); renderAuditLog(); renderTaskDescPreview();
                if (mode === 'edit' && taskId) {
                    const task = getTask(taskId); if (task) {
                        document.getElementById('taskEditId').value = task.id; document.getElementById('taskModalTitle').textContent = 'Edit Task';
                        document.getElementById('taskTitle').value = task.title; document.getElementById('taskDescription').value = task.description || '';
                        document.getElementById('taskPriority').value = task.priority; document.getElementById('taskDueDate').value = task.dueDate;
                        document.getElementById('taskStatus').value = task.status; document.getElementById('taskOriginalStatus').value = task.status;
                        document.getElementById('taskIsFuture').value = task.isFuture ? 'yes' : 'no';
                        if (task.subtasks) currentSubtasks = JSON.parse(JSON.stringify(task.subtasks));
                        if (task.auditLog) currentAuditLog = JSON.parse(JSON.stringify(task.auditLog));
                        populateCheckboxes(task.assignedTo || [], task.projectIds || []); renderSubtasks(); renderAuditLog(); renderTaskDescPreview();
                    }
                }
                if (mode === 'today') { document.getElementById('taskDueDate').value = new Date().toISOString().split('T')[0]; document.getElementById('taskIsFuture').value = 'no'; }
                if (mode === 'future') { document.getElementById('taskIsFuture').value = 'yes'; const d = new Date(); d.setDate(d.getDate() + 7); document.getElementById('taskDueDate').value = d.toISOString().split('T')[0]; }
                new bootstrap.Modal(document.getElementById('taskModal')).show();
            };
            function populateCheckboxes(sU = [], sP = []) { const m = getTeam(), p = getProjects(); document.getElementById('taskTeamCheckboxes').innerHTML = m.length ? m.map(x => `<div class="form-check"><input class="form-check-input task-user-cb" type="checkbox" value="${x.id}" ${sU.includes(x.id) ? 'checked' : ''}> <label>${escapeHtml(x.name)}</label></div>`).join('') : '<small class="text-muted">No members</small>'; document.getElementById('taskProjectCheckboxes').innerHTML = p.length ? p.map(x => `<div class="form-check"><input class="form-check-input task-project-cb" type="checkbox" value="${x.id}" ${sP.includes(x.id) ? 'checked' : ''}> <label>📁 ${escapeHtml(x.name)}</label></div>`).join('') : '<small class="text-muted">No projects</small>'; }
            window.saveTask = function () { const title = document.getElementById('taskTitle').value.trim(), due = document.getElementById('taskDueDate').value; if (!title) { showToast('Title required', 'warning'); return; } if (!due) { showToast('Due date required', 'warning'); return; } const tasks = getTasks(), editId = document.getElementById('taskEditId').value; const newStatus = document.getElementById('taskStatus').value, oldStatus = document.getElementById('taskOriginalStatus').value; const comment = document.getElementById('statusChangeComment').value.trim(); if (editId && newStatus !== oldStatus) currentAuditLog.push({ timestamp: new Date().toISOString(), oldStatus, newStatus, comment: comment || '' }); if (!editId) currentAuditLog.push({ timestamp: new Date().toISOString(), oldStatus: null, newStatus, comment: 'Task created' }); const assigned = [], proj = []; document.querySelectorAll('.task-user-cb:checked').forEach(c => assigned.push(c.value)); document.querySelectorAll('.task-project-cb:checked').forEach(c => proj.push(c.value)); const data = { id: editId || 'tsk_' + Date.now() + Math.random().toString(36).substr(2, 5), title, description: document.getElementById('taskDescription').value.trim(), priority: document.getElementById('taskPriority').value, dueDate: due, status: newStatus, isFuture: document.getElementById('taskIsFuture').value === 'yes', assignedTo: assigned, projectIds: proj, subtasks: currentSubtasks || [], auditLog: currentAuditLog || [], createdBy: currentUser ? currentUser.id : 'unknown', createdAt: editId ? (getTask(editId)?.createdAt || new Date().toISOString()) : new Date().toISOString(), updatedAt: new Date().toISOString() }; if (editId) { const idx = tasks.findIndex(t => t.id === editId); if (idx >= 0) tasks[idx] = data; } else tasks.push(data); saveTasks(tasks); bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide(); showToast(editId ? 'Task updated!' : 'Task added!', 'success'); refreshCurrentPage(); };
            window.deleteTask = function (id) { if (!confirm('Delete?')) return; saveTasks(getTasks().filter(t => t.id !== id)); showToast('Deleted', 'success'); refreshCurrentPage(); };
            window.openProjectModal = function (mode, id) { document.getElementById('projectEditId').value = ''; document.getElementById('projectModalTitle').textContent = 'Add Project'; document.getElementById('projectName').value = ''; document.getElementById('projectDescription').value = ''; document.getElementById('projectStatus').value = 'active'; if (mode === 'edit' && id) { const p = getProject(id); if (p) { document.getElementById('projectEditId').value = p.id; document.getElementById('projectModalTitle').textContent = 'Edit Project'; document.getElementById('projectName').value = p.name; document.getElementById('projectDescription').value = p.description || ''; document.getElementById('projectStatus').value = p.status; } } new bootstrap.Modal(document.getElementById('projectModal')).show(); };
            window.saveProject = function () { const name = document.getElementById('projectName').value.trim(); if (!name) { showToast('Project name required.', 'warning'); return; } const projects = getProjects(); const editId = document.getElementById('projectEditId').value; const data = { id: editId || 'prj_' + Date.now(), name, description: document.getElementById('projectDescription').value.trim(), status: document.getElementById('projectStatus').value, createdAt: editId ? (getProject(editId)?.createdAt || new Date().toISOString()) : new Date().toISOString() }; if (editId) { const idx = projects.findIndex(p => p.id === editId); if (idx >= 0) projects[idx] = data; } else projects.push(data); saveProjects(projects); bootstrap.Modal.getInstance(document.getElementById('projectModal')).hide(); showToast('Project saved!', 'success'); refreshCurrentPage(); };
            window.deleteProject = function (id) { if (!confirm('Delete project?')) return; saveProjects(getProjects().filter(p => p.id !== id)); const tasks = getTasks().map(t => { if (t.projectIds) t.projectIds = t.projectIds.filter(pid => pid !== id); return t; }); saveTasks(tasks); showToast('Project deleted.', 'success'); refreshCurrentPage(); };
            window.openTeamMemberModal = function (mode, id) { document.getElementById('teamEditId').value = ''; document.getElementById('teamName').value = ''; document.getElementById('teamEmail').value = ''; document.getElementById('teamRole').value = ''; if (mode === 'edit' && id) { const m = getMember(id); if (m) { document.getElementById('teamEditId').value = m.id; document.getElementById('teamName').value = m.name; document.getElementById('teamEmail').value = m.email || ''; document.getElementById('teamRole').value = m.role || ''; } } new bootstrap.Modal(document.getElementById('teamMemberModal')).show(); };
            window.saveTeamMember = function () { const name = document.getElementById('teamName').value.trim(); if (!name) { showToast('Name required.', 'warning'); return; } const members = getTeam(); const editId = document.getElementById('teamEditId').value; const data = { id: editId || 'mem_' + Date.now(), name, email: document.getElementById('teamEmail').value.trim(), role: document.getElementById('teamRole').value.trim(), createdAt: editId ? (getMember(editId)?.createdAt || new Date().toISOString()) : new Date().toISOString() }; if (editId) { const idx = members.findIndex(m => m.id === editId); if (idx >= 0) members[idx] = data; } else members.push(data); saveTeam(members); bootstrap.Modal.getInstance(document.getElementById('teamMemberModal')).hide(); showToast('Team member saved!', 'success'); refreshCurrentPage(); };
            window.deleteTeamMember = function (id) { if (!confirm('Delete member?')) return; saveTeam(getTeam().filter(m => m.id !== id)); const tasks = getTasks().map(t => { if (t.assignedTo) t.assignedTo = t.assignedTo.filter(uid => uid !== id); return t; }); saveTasks(tasks); showToast('Member deleted.', 'success'); refreshCurrentPage(); };
            window.openNoteModal = function (mode, id) { document.getElementById('noteEditId').value = ''; document.getElementById('noteTitle').value = ''; document.getElementById('noteContent').value = ''; document.getElementById('noteCategory').value = 'general'; renderNotePreview(); if (mode === 'edit' && id) { const notes = getNotes(); const n = notes.find(nt => nt.id === id); if (n) { document.getElementById('noteEditId').value = n.id; document.getElementById('noteTitle').value = n.title || ''; document.getElementById('noteContent').value = n.content || ''; document.getElementById('noteCategory').value = n.category || 'general'; renderNotePreview(); } } new bootstrap.Modal(document.getElementById('noteModal')).show(); };
            window.saveNote = function () { const content = document.getElementById('noteContent').value.trim(); const title = document.getElementById('noteTitle').value.trim(); if (!content && !title) { showToast('Please add some content.', 'warning'); return; } const notes = getNotes(); const editId = document.getElementById('noteEditId').value; const data = { id: editId || 'note_' + Date.now(), title: title || 'Untitled', content, category: document.getElementById('noteCategory').value, createdAt: editId ? (notes.find(n => n.id === editId)?.createdAt || new Date().toISOString()) : new Date().toISOString(), updatedAt: new Date().toISOString() }; if (editId) { const idx = notes.findIndex(n => n.id === editId); if (idx >= 0) notes[idx] = data; } else notes.push(data); saveNotes(notes); bootstrap.Modal.getInstance(document.getElementById('noteModal')).hide(); showToast('Note saved!', 'success'); refreshCurrentPage(); };
            window.deleteNote = function (id) { if (!confirm('Delete note?')) return; saveNotes(getNotes().filter(n => n.id !== id)); showToast('Note deleted.', 'success'); refreshCurrentPage(); };
            window.viewNoteFullscreen = function (noteId) { const notes = getNotes(); const note = notes.find(n => n.id === noteId); if (!note) return; document.getElementById('fullscreenNoteTitle').textContent = note.title || 'Untitled'; document.getElementById('fullscreenNoteContent').innerHTML = parseFormatting(note.content || ''); document.getElementById('noteFullscreenOverlay').style.display = 'flex'; };
            window.closeNoteFullscreen = function () { document.getElementById('noteFullscreenOverlay').style.display = 'none'; };

            // Google Drive
            function getDriveConfig() { return load('gdrive_config', { clientId: '', folderName: '' }); }
            window.saveGoogleDriveConfig = function () { const clientId = document.getElementById('gdriveClientId').value.trim(); const folderName = document.getElementById('gdriveFolderName').value.trim(); if (!clientId || !folderName) { showToast('Please enter both Client ID and Folder Name.', 'warning'); return; } save('gdrive_config', { clientId, folderName }); showToast('Google Drive config saved!', 'success'); };
            function loadDriveConfigInputs() { const config = getDriveConfig(); document.getElementById('gdriveClientId').value = config.clientId || ''; document.getElementById('gdriveFolderName').value = config.folderName || ''; }
            function setDriveStatus(msg, isError = false) { const el = document.getElementById('driveStatus'); if (el) { el.textContent = msg; el.className = 'mt-2 ' + (isError ? 'drive-status-error' : 'drive-status-success'); } }
            let googleTokenClient = null;
            async function ensureGoogleAuth() {
                if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
                    const loaded = await new Promise((resolve) => { let waited = 0; const check = () => { if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) resolve(true); else if (waited >= 10000) resolve(false); else { waited += 300; setTimeout(check, 300); } }; check(); });
                    if (!loaded) { showToast('Google sign-in script failed to load.', 'error'); return null; }
                }
                const config = getDriveConfig(); if (!config.clientId) { showToast('Please configure Google OAuth Client ID in Settings.', 'warning'); return null; }
                if (!googleTokenClient) { googleTokenClient = google.accounts.oauth2.initTokenClient({ client_id: config.clientId, scope: 'https://www.googleapis.com/auth/drive.file', callback: (tokenResponse) => { if (tokenResponse && tokenResponse.access_token) { localStorage.setItem('gdrive_token_' + currentUser.id, tokenResponse.access_token); } } }); }
                let token = localStorage.getItem('gdrive_token_' + currentUser.id);
                if (token) {
                    try { const testRes = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', { headers: { Authorization: 'Bearer ' + token } }); if (!testRes.ok) { localStorage.removeItem('gdrive_token_' + currentUser.id); token = null; } } catch (e) { token = null; }
                }
                if (!token) { googleTokenClient.requestAccessToken(); await new Promise(resolve => setTimeout(resolve, 2000)); token = localStorage.getItem('gdrive_token_' + currentUser.id); }
                return token;
            }
            async function getOrCreateDriveFolder(token, folderName) {
                const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`, { headers: { Authorization: 'Bearer ' + token } });
                const searchData = await searchRes.json(); if (searchData.files && searchData.files.length) return searchData.files[0].id;
                const createRes = await fetch('https://www.googleapis.com/drive/v3/files', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder' }) });
                const folder = await createRes.json(); return folder.id || null;
            }
            window.uploadToGoogleDrive = async function () {
                setDriveStatus('⏳ Backup ho raha hai...');
                const token = await ensureGoogleAuth(); if (!token) { setDriveStatus('❌ Authentication failed.', true); return; }
                const config = getDriveConfig();
                const data = getAllData(); data.exportDate = new Date().toISOString();
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const fileName = `taskflow_backup_${year}_${month}.json`;
                const content = JSON.stringify(data, null, 2);
                try {
                    const folderId = await getOrCreateDriveFolder(token, config.folderName);
                    if (!folderId) { setDriveStatus('❌ Could not access Drive folder.', true); return; }
                    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${folderId}' in parents and trashed=false&fields=files(id)`, { headers: { Authorization: 'Bearer ' + token } });
                    const existing = await searchRes.json();
                    let resp;
                    if (existing.files && existing.files.length > 0) {
                        const fileId = existing.files[0].id;
                        resp = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, { method: 'PATCH', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: content });
                    } else {
                        const metadata = { name: fileName, parents: [folderId], mimeType: 'application/json' };
                        const boundary = 'taskflow_boundary_' + Date.now();
                        const body = [`--${boundary}`, 'Content-Type: application/json; charset=UTF-8', '', JSON.stringify(metadata), `--${boundary}`, 'Content-Type: application/json', '', content, `--${boundary}--`].join('\r\n');
                        resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/related; boundary="' + boundary + '"' }, body });
                    }
                    if (resp.ok) { setDriveStatus(`✅ Backup ho gaya! (${fileName})`); showToast('Backed up to Google Drive!', 'success'); }
                    else throw new Error('Upload failed: ' + resp.status);
                } catch (err) { setDriveStatus('❌ Error: ' + err.message, true); showToast('Drive upload error.', 'error'); }
            };
            window.listGoogleDriveFiles = async function () {
                setDriveStatus('⏳ Drive files list ho rahi hai...');
                const token = await ensureGoogleAuth(); if (!token) { setDriveStatus('❌ Auth failed.', true); return; }
                const config = getDriveConfig(); const folderId = await getOrCreateDriveFolder(token, config.folderName);
                if (!folderId) { document.getElementById('driveFileList').innerHTML = '<small class="text-muted">Could not access Drive folder.</small>'; setDriveStatus(''); return; }
                try {
                    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&orderBy=createdTime desc&pageSize=10`, { headers: { Authorization: 'Bearer ' + token } });
                    const data = await res.json(); const container = document.getElementById('driveFileList');
                    if (data.files && data.files.length) { container.innerHTML = '<strong>📂 Backup files:</strong><br>' + data.files.map(f => `<div class="border rounded p-2 mt-1 d-flex justify-content-between align-items-center"><span>📄 ${f.name}</span><button class="btn btn-sm btn-primary-custom" onclick="restoreFromGoogleDrive('${f.id}')">Restore</button></div>`).join(''); }
                    else container.innerHTML = '<small class="text-muted">No backups found.</small>';
                    setDriveStatus('✅ Files loaded.');
                } catch (err) { setDriveStatus('❌ Error listing files: ' + err.message, true); }
            };
            window.restoreFromGoogleDrive = async function (fileId) {
                if (!confirm('Restore data from this backup? Current data will be replaced.')) return;
                setDriveStatus('⏳ Restore ho raha hai...');
                const token = await ensureGoogleAuth(); if (!token) { setDriveStatus('❌ Auth failed.', true); return; }
                try {
                    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers: { Authorization: 'Bearer ' + token } });
                    const data = await res.json(); restore(data); showToast('✅ Data restored!', 'success');
                    setDriveStatus('✅ Restore ho gaya!'); refreshCurrentPage();
                } catch (err) { setDriveStatus('❌ Restore failed: ' + err.message, true); }
            };

            // Navigation
            function navigateTo(page) {
                currentPage = page;
                document.querySelectorAll('.section-page').forEach(el => el.classList.remove('active'));
                const pEl = document.getElementById('page-' + page); if (pEl) pEl.classList.add('active');
                document.querySelectorAll('.sidebar-nav .nav-link').forEach(el => el.classList.remove('active'));
                const nav = document.querySelector(`[data-page="${page}"]`); if (nav) nav.classList.add('active');
                const titles = { dashboard: '📊 Dashboard', tasks: '📋 All Tasks', todayTasks: '📅 Today\'s Tasks', futureTasks: '🔮 Future Tasks', projects: '📁 Projects', team: '👥 Team Members', notes: '📝 Notes', eod: '📧 EOD Report', settings: '⚙️ Settings & Sync' };
                document.getElementById('pageTitle').textContent = titles[page] || page;
                if (currentUser) localStorage.setItem(LAST_PAGE_KEY, page);
                refreshCurrentPage();
                if (page === 'settings') loadDriveConfigInputs();
            }
            function refreshCurrentPage() {
                switch (currentPage) {
                    case 'dashboard': refreshDashboard(); break;
                    case 'tasks': refreshAllTasks(); break;
                    case 'todayTasks': refreshTodayTasks(); break;
                    case 'futureTasks': refreshFutureTasks(); break;
                    case 'projects': refreshProjects(); break;
                    case 'team': refreshTeam(); break;
                    case 'notes': refreshNotes(); break;
                }
                updateDashboardStats();
            }
            function updateDashboardStats() {
                const tasks = getTasks(), today = new Date().toISOString().split('T')[0];
                document.getElementById('statTotalTasks').textContent = tasks.length;
                document.getElementById('statTodayTasks').textContent = tasks.filter(t => t.dueDate === today).length;
                document.getElementById('statPendingTasks').textContent = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
                document.getElementById('statCompletedTasks').textContent = tasks.filter(t => t.status === 'completed').length;
                document.getElementById('dashTaskCount').textContent = tasks.filter(t => t.status === 'pending').length;
            }
            function getSubtaskBadge(task) { if (!task.subtasks || !task.subtasks.length) return ''; const done = task.subtasks.filter(s => s.status === 'completed').length; const total = task.subtasks.length; return ` <span class="badge bg-secondary" style="font-size:0.65rem;">📋 ${done}/${total}</span>`; }
            function refreshDashboard() {
                const tasks = getTasks(); const sorted = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
                const tbody = document.getElementById('recentTasksBody');
                if (!sorted.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><i class="fas fa-inbox"></i><p>No tasks yet.</p></td></tr>'; return; }
                tbody.innerHTML = sorted.map(t => `<tr class="task-row ${t.priority}-row" onclick="openTaskModal('edit','${t.id}')"><td><strong>${escapeHtml(t.title)}</strong>${getSubtaskBadge(t)}<br><small class="text-muted rich-text-content">${formatPreview(t.description || '', 60)}</small></td><td><span class="priority-badge priority-${t.priority}">${t.priority.toUpperCase()}</span></td><td>${formatDate(t.dueDate)} ${t.isFuture ? '<span class="badge bg-info">Future</span>' : ''}</td><td><span class="badge bg-${t.status === 'completed' ? 'success' : t.status === 'in-progress' ? 'primary' : t.status === 'blocked' ? 'danger' : 'warning'}">${t.status}</span></td></tr>`).join('');
            }
            function refreshAllTasks() {
                const tasks = getTasks(); const tbody = document.getElementById('allTasksBody');
                if (!tasks.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><i class="fas fa-tasks"></i><p>No tasks yet.</p></td></tr>'; return; }
                tbody.innerHTML = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(t => { const conns = []; if (t.assignedTo && t.assignedTo.length) t.assignedTo.forEach(uid => { const m = getMember(uid); if (m) conns.push(`<span class="task-connection-tag user">👤 ${escapeHtml(m.name)}</span>`); }); if (t.projectIds && t.projectIds.length) t.projectIds.forEach(pid => { const p = getProject(pid); if (p) conns.push(`<span class="task-connection-tag project">📁 ${escapeHtml(p.name)}</span>`); }); return `<tr class="task-row ${t.priority}-row"><td><strong>${escapeHtml(t.title)}</strong>${getSubtaskBadge(t)}<br><small class="rich-text-content">${formatPreview(t.description || '', 50)}</small></td><td><span class="priority-badge priority-${t.priority}">${t.priority.toUpperCase()}</span></td><td>${formatDate(t.dueDate)} ${t.isFuture ? '<span class="badge bg-info">Future</span>' : ''}</td><td>${conns.length ? conns.join(' ') : '<small class="text-muted">None</small>'}</td><td><span class="badge bg-${t.status === 'completed' ? 'success' : t.status === 'in-progress' ? 'primary' : t.status === 'blocked' ? 'danger' : 'warning'}">${t.status}</span></td><td><button class="btn btn-sm btn-outline-primary me-1" onclick="event.stopPropagation();openTaskModal('edit','${t.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation();deleteTask('${t.id}')"><i class="fas fa-trash"></i></button></td></tr>`; }).join('');
            }
            function refreshTodayTasks() { const today = new Date().toISOString().split('T')[0]; const tasks = getTasks().filter(t => t.dueDate === today && !t.isFuture); renderTaskCards(document.getElementById('todayTasksList'), tasks, 'today'); }
            function refreshFutureTasks() { const tasks = getTasks().filter(t => t.isFuture === true || t.dueDate > new Date().toISOString().split('T')[0]); renderTaskCards(document.getElementById('futureTasksList'), tasks, 'future'); }
            function renderTaskCards(container, tasks, context) {
                if (!tasks.length) { container.innerHTML = `<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No tasks here. <a href="#" onclick="openTaskModal('${context}')">Add one!</a></p></div>`; return; }
                container.innerHTML = tasks.map(t => { const conns = []; if (t.assignedTo && t.assignedTo.length) t.assignedTo.forEach(uid => { const m = getMember(uid); if (m) conns.push(`<span class="task-connection-tag user">👤 ${escapeHtml(m.name)}</span>`); }); if (t.projectIds && t.projectIds.length) t.projectIds.forEach(pid => { const p = getProject(pid); if (p) conns.push(`<span class="task-connection-tag project">📁 ${escapeHtml(p.name)}</span>`); }); return `<div class="card-custom task-row ${t.priority}-row" style="cursor:pointer;" onclick="openTaskModal('edit','${t.id}')"><div class="d-flex justify-content-between align-items-start flex-wrap"><div><h6 class="fw-bold mb-1">${escapeHtml(t.title)} ${getSubtaskBadge(t)}</h6><small class="text-muted rich-text-content">${formatPreview(t.description || '', 80)}</small></div><span class="priority-badge priority-${t.priority}">${t.priority.toUpperCase()}</span></div><div class="mt-2 d-flex gap-2 flex-wrap align-items-center"><span class="badge bg-${t.status === 'completed' ? 'success' : t.status === 'in-progress' ? 'primary' : t.status === 'blocked' ? 'danger' : 'warning'}">${t.status}</span><small class="text-muted">📅 ${formatDate(t.dueDate)}</small> ${conns.join(' ')}</div><div class="mt-2"><button class="btn btn-sm btn-outline-primary me-1" onclick="event.stopPropagation();openTaskModal('edit','${t.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation();deleteTask('${t.id}')"><i class="fas fa-trash"></i></button></div></div>`; }).join('');
            }
            function refreshProjects() { const projects = getProjects(); const grid = document.getElementById('projectsGrid'); if (!projects.length) { grid.innerHTML = '<div class="col-12 empty-state"><i class="fas fa-folder-open"></i><p>No projects yet.</p></div>'; return; } grid.innerHTML = projects.map(p => `<div class="col-md-4 col-sm-6"><div class="card-custom h-100"><h6 class="fw-bold">📁 ${escapeHtml(p.name)}</h6><p class="text-muted small">${escapeHtml(p.description || 'No description')}</p><span class="badge bg-${p.status === 'active' ? 'success' : p.status === 'completed' ? 'secondary' : 'warning'}">${p.status}</span><div class="mt-2"><button class="btn btn-sm btn-outline-primary" onclick="openProjectModal('edit','${p.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-outline-danger" onclick="deleteProject('${p.id}')"><i class="fas fa-trash"></i></button></div></div></div>`).join(''); }
            function refreshTeam() { const members = getTeam(); const grid = document.getElementById('teamGrid'); if (!members.length) { grid.innerHTML = '<div class="col-12 empty-state"><i class="fas fa-user-group"></i><p>No team members yet.</p></div>'; return; } grid.innerHTML = members.map(m => `<div class="col-md-3 col-sm-6"><div class="card-custom text-center h-100"><div class="user-avatar mx-auto mb-2" style="width:50px;height:50px;font-size:1.2rem;">${m.name.charAt(0).toUpperCase()}</div><h6 class="fw-bold mb-0">${escapeHtml(m.name)}</h6><small class="text-muted">${escapeHtml(m.role || 'Team Member')}</small><br><small>${escapeHtml(m.email || '')}</small><div class="mt-2"><button class="btn btn-sm btn-outline-primary" onclick="openTeamMemberModal('edit','${m.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-outline-danger" onclick="deleteTeamMember('${m.id}')"><i class="fas fa-trash"></i></button></div></div></div>`).join(''); }
            function refreshNotes() { const notes = getNotes(); const grid = document.getElementById('notesGrid'); if (!notes.length) { grid.innerHTML = '<div class="col-12 empty-state"><i class="fas fa-sticky-note"></i><p>No notes yet.</p></div>'; return; } grid.innerHTML = notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(n => `<div class="col-md-4 col-sm-6"><div class="card-custom h-100"><span class="badge bg-secondary mb-1">${n.category || 'general'}</span><h6 class="fw-bold">${escapeHtml(n.title || 'Untitled')}</h6><p class="text-muted small rich-text-content" style="white-space:pre-wrap;">${formatPreview(n.content || '', 150)}</p><small class="text-muted">Updated: ${formatDateTime(n.updatedAt)}</small><div class="mt-2"><button class="btn btn-sm btn-outline-primary" onclick="openNoteModal('edit','${n.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-outline-info" onclick="viewNoteFullscreen('${n.id}')"><i class="fas fa-eye"></i></button><button class="btn btn-sm btn-outline-danger" onclick="deleteNote('${n.id}')"><i class="fas fa-trash"></i></button></div></div></div>`).join(''); }

            window.generateEODReport = function () {
                const today = new Date().toISOString().split('T')[0]; const allTasks = getTasks();
                const userName = currentUser ? currentUser.name : 'User';
                const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const completedToday = allTasks.filter(t => { if (t.status !== 'completed') return false; if (t.auditLog && t.auditLog.length) { const lastCompleted = [...t.auditLog].reverse().find(e => e.newStatus === 'completed'); if (lastCompleted && lastCompleted.timestamp.startsWith(today)) return true; } return t.dueDate === today; });
                const pendingToday = allTasks.filter(t => { if (t.status === 'completed') return false; if (t.isFuture && t.dueDate > today) return false; return t.dueDate <= today; });
                let report = `📧 EOD Report - ${dateStr}\n👤 By: ${userName}\n${'─'.repeat(40)}\n\n✅ Completed Today (${completedToday.length}):\n`;
                if (completedToday.length) completedToday.forEach((t, i) => { report += `  ${i + 1}. ${t.title} [${t.priority.toUpperCase()}]\n`; }); else report += `  No tasks completed today.\n`;
                report += `\n📋 Pending/In Progress (${pendingToday.length}):\n`;
                if (pendingToday.length) pendingToday.forEach((t, i) => { report += `  ${i + 1}. ${t.title} - ${t.status} [${t.priority.toUpperCase()}] 📅 ${formatDate(t.dueDate)}\n`; if (t.description) report += `     ${t.description.substring(0, 80)}\n`; if (t.subtasks && t.subtasks.length) { const done = t.subtasks.filter(s => s.status === 'completed').length; report += `     📋 Subtasks: ${done}/${t.subtasks.length} completed\n`; } }); else report += `  All caught up!\n`;
                report += `\n${'─'.repeat(40)}\n🔗 Connections:\n`; const allToday = [...completedToday, ...pendingToday]; const uProj = new Set(), uPpl = new Set();
                allToday.forEach(t => { if (t.projectIds) t.projectIds.forEach(p => uProj.add(p)); if (t.assignedTo) t.assignedTo.forEach(u => uPpl.add(u)); });
                if (uProj.size) { report += `  📁 Projects: `; uProj.forEach(pid => { const p = getProject(pid); if (p) report += `${p.name}, `; }); report = report.replace(/, $/, '\n'); }
                if (uPpl.size) { report += `  👥 Team: `; uPpl.forEach(uid => { const m = getMember(uid); if (m) report += `${m.name}, `; }); report = report.replace(/, $/, '\n'); }
                report += `\n${'─'.repeat(40)}\n⚡ Generated by TaskFlow Pro`;
                document.getElementById('eodReportContent').textContent = report; showToast('EOD Report generated!', 'success');
            };
            window.copyEODReport = function () { const content = document.getElementById('eodReportContent').textContent; if (content.includes('Click "Generate')) { showToast('Please generate the report first.', 'warning'); return; } navigator.clipboard.writeText(content).then(() => showToast('📋 Copied!', 'success')).catch(() => showToast('Failed', 'error')); };
            document.getElementById('slackCopyBtn').addEventListener('click', () => { const content = document.getElementById('eodReportContent').textContent; if (content.includes('Click "Generate')) { showToast('Please generate the report first.', 'warning'); return; } navigator.clipboard.writeText('```\n' + content + '\n```').then(() => showToast('📋 Slack code block copied!', 'success')).catch(() => showToast('Failed', 'error')); });

            window.exportData = function () { const data = getAllData(); data.exportDate = new Date().toISOString(); const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`; a.click(); showToast('Exported!', 'success'); };
            window.importData = function (event) { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function (e) { try { const data = JSON.parse(e.target.result); if (!data.tasks && !data.projects) { showToast('Invalid file', 'error'); return; } if (confirm('Replace all data?')) { restore(data); showToast('Imported!', 'success'); refreshCurrentPage(); } } catch (err) { showToast('Failed to parse JSON', 'error'); } }; reader.readAsText(file); event.target.value = ''; };
            window.clearAllData = function () { if (confirm('⚠️ Delete ALL data?')) { save('tasks', []); save('projects', []); save('teamMembers', []); save('notes', []); showToast('All data cleared.', 'success'); refreshCurrentPage(); } };

            function escapeHtml(str) { if (!str) return ''; const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
            function formatDate(ds) { if (!ds) return 'N/A'; const d = new Date(ds + 'T00:00:00'); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
            function formatDateTime(iso) { if (!iso) return 'N/A'; const d = new Date(iso); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }

            // ---------- SESSION TIMEOUT ----------
            function getTimeoutMs() {
                const mins = parseInt(localStorage.getItem(TIMEOUT_KEY) || '5') || 5;
                return mins * 60 * 1000;
            }
            function resetSessionTimer() {
                if (!currentUser || locked) return;
                clearTimeout(sessionTimer);
                clearInterval(sessionTickTimer);
                sessionTimer = setTimeout(lockSession, getTimeoutMs());
            }
            function stopSessionTimer() {
                clearTimeout(sessionTimer);
                clearInterval(sessionTickTimer);
            }
            function lockSession() {
                if (!currentUser) return;
                locked = true;
                document.getElementById('sessionOverlay').classList.add('show');
                document.getElementById('mainContent').classList.add('blur-content');
                document.getElementById('sessionPassword').value = '';
                document.getElementById('sessionPassword').focus();
                // stop activity timer during lock
                clearTimeout(sessionTimer);
                clearInterval(sessionTickTimer);
            }
            function unlockSession() {
                const pass = document.getElementById('sessionPassword').value;
                if (!currentUser) return;
                // check password
                const all = users(); const u = all.find(x => x.id === currentUser.id);
                if (!u || u.passwordHash !== hash(pass)) {
                    showToast('Incorrect password', 'error');
                    document.getElementById('sessionPassword').value = '';
                    document.getElementById('sessionPassword').focus();
                    return;
                }
                hideSessionOverlay();
                locked = false;
                resetSessionTimer();
            }
            function hideSessionOverlay() {
                document.getElementById('sessionOverlay').classList.remove('show');
                document.getElementById('mainContent').classList.remove('blur-content');
                document.getElementById('sessionPassword').value = '';
            }
            window.unlockSession = unlockSession;
            window.sessionLogout = function () {
                hideSessionOverlay();
                logout();
            };

            function saveTimeoutSetting() {
                const val = parseInt(document.getElementById('timeoutMinutes').value) || 5;
                localStorage.setItem(TIMEOUT_KEY, val);
                resetSessionTimer();
            }
            window.saveTimeoutSetting = saveTimeoutSetting;

            // Activity listeners
            ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(ev => {
                document.addEventListener(ev, () => {
                    if (currentUser && !locked && document.getElementById('appContainer').style.display !== 'none') {
                        resetSessionTimer();
                    }
                }, { passive: true });
            });

            // ---------- STARTUP & PAGE PERSISTENCE ----------
            function startAppWithUser() {
                document.getElementById('authContainer').style.display = 'none';
                document.getElementById('appContainer').style.display = 'flex';
                document.getElementById('userDisplayName').textContent = currentUser.name;
                document.getElementById('userAvatarLetter').textContent = currentUser.name.charAt(0).toUpperCase();
                document.getElementById('currentDateDisplay').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const lastPage = localStorage.getItem(LAST_PAGE_KEY) || 'dashboard';
                // Load timeout setting
                const savedTimeout = localStorage.getItem(TIMEOUT_KEY) || '5';
                const timeoutInput = document.getElementById('timeoutMinutes');
                if (timeoutInput) timeoutInput.value = savedTimeout;
                resetSessionTimer();
                navigateTo(lastPage);
            }
            function init() {
                const savedUserId = localStorage.getItem(APP_PREFIX + 'current_user_id');
                if (savedUserId) {
                    const users = JSON.parse(localStorage.getItem(APP_PREFIX + 'all_users') || '[]');
                    const user = users.find(u => u.id === savedUserId);
                    if (user) {
                        currentUser = user;
                        startAppWithUser();
                        return;
                    } else {
                        localStorage.removeItem(APP_PREFIX + 'current_user_id');
                    }
                }
                document.getElementById('authContainer').style.display = 'flex';
                document.getElementById('appContainer').style.display = 'none';
                document.getElementById('currentDateDisplay').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }

            document.getElementById('loginForm').addEventListener('submit', function (e) {
                e.preventDefault();
                if (login(document.getElementById('loginEmail').value.trim(), document.getElementById('loginPassword').value)) {
                    startAppWithUser();
                }
            });
            document.getElementById('registerForm').addEventListener('submit', function (e) {
                e.preventDefault();
                const name = document.getElementById('regName').value.trim();
                const email = document.getElementById('regEmail').value.trim();
                const password = document.getElementById('regPassword').value;
                const confirm = document.getElementById('regConfirmPassword').value;
                if (!name) { showToast('Name required', 'warning'); return; }
                if (password.length < 6) { showToast('Password min 6 chars', 'warning'); return; }
                if (password !== confirm) { showToast('Passwords mismatch', 'warning'); return; }
                if (register(name, email, password)) {
                    showLogin();
                    document.getElementById('loginEmail').value = email;
                }
            });
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.addEventListener('click', function () {
                const page = this.getAttribute('data-page');
                if (page) navigateTo(page);
            }));

            init();
        })();
    </script>
    <script src="https://apis.google.com/js/api.js"></script>
    <script src="https://accounts.google.com/gsi/client"></script>
    <script>
        (function checkGoogle() {
            if (typeof window.initGoogleApiClient === 'function' && typeof gapi !== 'undefined') { window.initGoogleApiClient(); }
            else { setTimeout(checkGoogle, 500); }
        })();
    </script>
</body>

</html>
