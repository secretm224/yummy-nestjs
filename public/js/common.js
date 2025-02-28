function toggleMenu() {
    const menu = document.getElementById('status-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function logout() {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //location.href = "/logout";
    window.location.reload();
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}