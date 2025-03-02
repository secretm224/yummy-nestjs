document.addEventListener("DOMContentLoaded", function () {
    // ✅ 탭 전환 기능
    function changeTab(index) {
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
            contents[i].classList.toggle('active', i === index);
        });
    }

    // ✅ 정적 색인 실행 버튼 클릭 시
    document.getElementById('staticIndexBtn').addEventListener('click', function () {
        alert("준비 중인 기능입니다.");
    });

    // ✅ 동적 색인 실행 버튼 클릭 시
    document.getElementById('dynamicIndexBtn').addEventListener('click', function () {
       alert("준비 중인 기능입니다.");
    });

    // ✅ 전역 스코프에서 함수 사용 가능하도록 설정
    window.changeTab = changeTab;
});
