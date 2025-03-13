const data = ["사과", "바나나", "포도", "오렌지", "수박", "딸기", "참외", "복숭아", "자두", "망고", "키위", "레몬", "파인애플", "블루베리" ];
let filteredData = [...data];
let currentPage = 1;
const itemsPerPage = 5;

function search() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    filteredData = data.filter(item => item.includes(query));
    currentPage = 1;
    render();
}

function render() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleItems = filteredData.slice(start, end);
    
    document.getElementById("resultList").innerHTML = visibleItems.length > 0 
        ? visibleItems.map(item => `<div>${item}</div>`).join("")
        : "검색 결과 없음";
    
    document.getElementById("paginationInfo").innerText = `${currentPage}/${Math.max(1, Math.ceil(filteredData.length / itemsPerPage))}`;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        render();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
        currentPage++;
        render();
    }
}


async function selectMajorType(majorType)
{

    try {

        const response = await fetch(`/storeTypeSub/findSubTypes?majorType=${majorType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const subTypes = await response.json();


if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}

    } catch(err) {
        console.error('Error selectMajorType: ', err);
    }

}


render();