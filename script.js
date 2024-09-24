document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginError = document.getElementById("loginError");
    const mainScreen = document.getElementById("mainScreen");
    const loginScreen = document.getElementById("loginScreen");

    const employeeInfoLink = document.getElementById("employeeInfoLink");
    const overtimeReportLink = document.getElementById("overtimeReportLink");
    const taskManagementLink = document.getElementById("taskManagementLink");

    const employeeInfo = document.getElementById("employeeInfo");
    const overtimeReport = document.getElementById("overtimeReport");
    const taskManagement = document.getElementById("taskManagement");

    const userDisplay = document.getElementById("user");
    const employeeList = document.getElementById("employeeList");
    const overtimeList = document.getElementById("publicOvertimeList");
    const taskEmployee = document.getElementById("taskEmployee");
    const taskList = document.getElementById("taskList");

    // Danh sách người dùng với thông tin chi tiết
    const users = [
        {
            username: 'RC00015',
            password: '04091999',
            name: 'Nguyễn Trung Hiếu',
            gender: 'Nam',
            birthDate: '04/09/1999',
            position: 'Phó chủ quản'
        },
        {
            username: 'RC00003',
            password: '123456',
            name: 'LIU GUOQING',
            gender: 'Nam',
            birthDate: '01/01/1990',
            position: 'Giám đốc'
        }
    ];

    let overtimes = [];
    let tasks = [];

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
        const user = users.find(user => user.username === storedUsername);
        if (user) {
            showMainScreen(user.username, user.name);
        }
    }

    // Xử lý đăng nhập
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Tìm kiếm người dùng với username và mật khẩu
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem("username", user.username);
            localStorage.setItem("name", user.name);
            showMainScreen(user.username, user.name);
        } else {
            loginError.style.display = "block";  // Hiển thị lỗi đăng nhập
        }
    });

    function showMainScreen(username, name) {
        loginScreen.style.display = "none";
        mainScreen.style.display = "block";
        userDisplay.textContent = name;
        loadEmployees();
        loadOvertime();
        loadTasks();
    }

    // Đăng xuất
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        loginScreen.style.display = "block";
        mainScreen.style.display = "none";
    });

    // Hiển thị thông tin nhân viên
    employeeInfoLink.addEventListener("click", () => {
        employeeInfo.style.display = "block";
        overtimeReport.style.display = "none";
        taskManagement.style.display = "none";
    });

    // Hiển thị báo cáo tăng ca
    overtimeReportLink.addEventListener("click", () => {
        employeeInfo.style.display = "none";
        overtimeReport.style.display = "block";
        taskManagement.style.display = "none";
    });

    // Hiển thị chức năng nhiệm vụ
    taskManagementLink.addEventListener("click", () => {
        employeeInfo.style.display = "none";
        overtimeReport.style.display = "none";
        taskManagement.style.display = "block";
    });

    // Load danh sách nhân viên
    function loadEmployees() {
        employeeList.innerHTML = "";
        users.forEach((user, index) => {
            const row = `<tr>
                            <td>${user.name}</td>
                            <td>${user.birthDate}</td>
                            <td>${user.position}</td>
                            <td>${user.username}</td>
                        </tr>`;
            employeeList.innerHTML += row;

            const option = document.createElement("option");
            option.value = index;
            option.textContent = user.name;
            taskEmployee.appendChild(option);
        });
    }

    // Load danh sách tăng ca
    function loadOvertime() {
        overtimeList.innerHTML = "";
        overtimes.forEach((overtime, index) => {
            const li = `<li class="list-group-item" id="overtime-${index}">
                          ${overtime.user} - ${overtime.date}: ${overtime.hours} giờ 
                          <button class="btn btn-info btn-sm float-right" onclick="markAsReported(${index})">Đã Báo</button>
                        </li>`;
            overtimeList.innerHTML += li;
        });
    }

    // Xử lý khi bấm vào nút "Đã Báo"
    window.markAsReported = function(index) {
        const listItem = document.getElementById(`overtime-${index}`);
        listItem.style.transition = "opacity 2s";
        listItem.style.opacity = 0; // Làm mờ dần
        setTimeout(() => {
            overtimes.splice(index, 1); // Xóa báo cáo tăng ca sau 2 giây
            loadOvertime(); // Tải lại danh sách
        }, 2000); // Thời gian 2 giây để mục bị ẩn
    };

    // Load danh sách nhiệm vụ
    function loadTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = `<li class="list-group-item">
                          ${task.employee} - ${task.description} (Đến hạn: ${task.deadline}) 
                          <br> 
                          Trạng thái: ${task.status}
                          <br>
                          <button class="btn btn-success btn-sm btn-block mt-2" onclick="updateTaskStatus(${index}, 'Hoàn thành')">Hoàn thành</button>
                          <button class="btn btn-warning btn-sm btn-block mt-2" onclick="updateTaskStatus(${index}, 'Chưa hoàn thành')">Chưa hoàn thành</button>
                          <button class="btn btn-danger btn-sm btn-block mt-2" onclick="deleteTask(${index})">Xóa</button>
                        </li>`;
            taskList.innerHTML += li;
        });
    }

    // Gửi báo cáo tăng ca
    document.getElementById("overtimeForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("overtimeDate").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;

        const hours = calculateOvertime(startTime, endTime);
        const user = localStorage.getItem("name");
        overtimes.push({ user, date, hours });
        loadOvertime();
    });

    // Giao nhiệm vụ
    document.getElementById("taskForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const employeeIndex = document.getElementById("taskEmployee").value;
        const employee = users[employeeIndex].name;
        const description = document.getElementById("taskDescription").value;
        const deadline = document.getElementById("taskDeadline").value;
        tasks.push({ employee, description, deadline, status: "Chưa hoàn thành" });
        loadTasks();
    });

    // Tính toán số giờ tăng ca
    function calculateOvertime(startTime, endTime) {
        const start = new Date(`2024-01-01T${startTime}:00`);
        const end = new Date(`2024-01-01T${endTime}:00`);
        const diffMs = end - start;
        const diffHrs = diffMs / (1000 * 60 * 60);
        return diffHrs;
    }

    // Cập nhật trạng thái nhiệm vụ
    window.updateTaskStatus = function (index, status) {
        tasks[index].status = status;
        loadTasks();
    };

    // Xóa nhiệm vụ
    window.deleteTask = function(index) {
        tasks.splice(index, 1); // Xóa nhiệm vụ khỏi danh sách
        loadTasks(); // Tải lại danh sách nhiệm vụ
    };
});
