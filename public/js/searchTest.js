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


/**
 * 대분류 select 박스를 선택했을 때, 동적으로 소분류 select 박스를 만들어주는 함수.
 * 
 * @param {*} majorType - 대분류 코드
 */
async function selectMajorType(majorType)
{

    try {

        const response = await fetch(`/storeTypeSub/findSubTypes?majorType=${majorType}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const subTypes = await response.json();
        updateSubTypeSelect(subTypes);
    
    } catch (error) {
        console.error('Error selectMajorType:', error);
    }

}

/**
 * 소분류 셀렉트 박스를 동적으로 만들어주는 함수.
 * 
 * @param {*} subTypes 
 */
function updateSubTypeSelect(subTypes) {    

    console.log(subTypes);

    const selectBox = document.getElementById("select-sub");

    while (selectBox.options.length > 1) {
        selectBox.remove(1);
    }

    subTypes.forEach((data) => {
        const option = document.createElement("option");
        option.value = data.subType;
        option.textContent = data.typeName;
        selectBox.appendChild(option);
    });

}

let totalSearchData = [];
let curPage = 1;
let globalTotalPage = 1;

async function toalSearch() {

    const searchValue = document.getElementById("searchInput").value;
    const selectMajor = document.getElementById("select-major").value;
    const selectSub = document.getElementById("select-sub").value;


    try {

        const response = await fetch(`/search/totalSearch?searchValue=${searchValue}&selectMajor=${selectMajor}&selectSub=${selectSub}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("서버 요청 실패");
        }

        totalSearchData = [];
        const responseData = await response.json();
        responseData.forEach(item => totalSearchData.push(item));

        const totalPage = Math.floor(totalSearchData.length / 3);
        const remainderPage = totalSearchData.length % 3;

        globalTotalPage = totalPage;
        document.getElementById("total-page").textContent = totalPage;
        //console.log("totalPage:" + totalPage);
        //console.log("remainderPage:" + remainderPage);

        /* 기존 검색 데이터들을 모두 지워준다. */
        deleteData("total-search-datas");

        /* 검색데이터 불러옴 */
        //responseData.forEach(item => createTotalSearchData(item));
        responseData.slice(0, 3).forEach(item => createTotalSearchData(item));

    } catch(error) {
        console.error("error!");
    }
    
}

function nextPage() {
    if (curPage + 1 > globalTotalPage) {
        alert("마지막 페이지 입니다.");
    }
    
    curPage++;

}

function prevPage() {
    if (curPage - 1 < 1) {
        alert("첫번째 페이지 입니다.");
    }

    curPage--;
}


function deleteData(idName) {
    document.getElementById(idName).replaceChildren();
}

function createTotalSearchData(response) {

    const parentElement = document.getElementById("total-search-datas"); 

    const resultListWrapper = document.createElement("div");
    resultListWrapper.classList.add("result-list");

    const resultListImg = document.createElement("div");
    resultListImg.classList.add("result-list-img");

    const resultListContents = document.createElement("div");
    resultListContents.classList.add("result-list-contents");

    const resultListAddr = document.createElement("div");
    resultListAddr.classList.add("result-list-contents-addr");
    resultListAddr.textContent = response.address;

    const resultListSubject = document.createElement("div");
    resultListSubject.classList.add("result-list-contents-subject");
    resultListSubject.textContent = response.name;

    const resultListStar = document.createElement("div");
    resultListStar.classList.add("result-list-star");

    // 콘텐츠 컨테이너에 주소 & 제목 추가
    resultListContents.appendChild(resultListAddr);
    resultListContents.appendChild(resultListSubject);

    // 최상위 컨테이너에 요소 추가
    resultListWrapper.appendChild(resultListImg);
    resultListWrapper.appendChild(resultListContents);
    resultListWrapper.appendChild(resultListStar);

    parentElement.appendChild(resultListWrapper);

}