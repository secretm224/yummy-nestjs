//const { create } = require("domain");

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

document.getElementById("searchInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // 기본 동작 방지
        SearchManager.toalSearch(); // 검색 실행
    }
});

const SearchManager = {
    totalSearchData: [],
    curPage: 1,
    globalTotalPage: 1,
    paging: 5,

    async toalSearch() {
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
    
            this.totalSearchData = []; // 검색결과 초기화
            this.curPage = 1;
            const responseData = await response.json(); // 검색결과 json 파싱
            responseData.forEach(item => this.totalSearchData.push(item)); // 검색결과 통합검색 데이터 배열에 추가
            

            document.getElementById("find-store-title-value").textContent = this.totalSearchData.length;
            
            /* 페이징 처리 */
            let totalPage = Math.floor(this.totalSearchData.length / this.paging);
            const remainderPage = this.totalSearchData.length % this.paging;
            
            if (remainderPage > 0) {
                totalPage++;
            }
            
            console.log(this.totalSearchData.length);

            if (this.totalSearchData.length == 0) {
                this.globalTotalPage = 1;
            } else {
                this.globalTotalPage = totalPage; // 전체 페이지 초기화
            }
            
            document.getElementById("total-page").textContent = this.globalTotalPage; // 전체 페이지 시각화
            
            /* 기존 검색 데이터들을 모두 지워준다. */
            deleteData("total-search-datas");
    
            /* 검색데이터 불러옴 -> 초반 검색 데이터 */
            responseData.slice(0, this.paging).forEach(item => createTotalSearchData(item));
            //responseData.forEach(item => createTotalSearchData(item));
    
        } catch(error) {
            console.error(`error: ${error}`);
        }
    },
    nextPage() {
        if (this.curPage + 1 > this.globalTotalPage) {
            alert("마지막 페이지 입니다.");
            return;
        }
        
        this.curPage++;
        /* 기존 검색 데이터들을 모두 지워준다. */
        deleteData("total-search-datas");

        const startIdx = this.paging * (this.curPage - 1);
        const lastIdx = startIdx + this.paging;

        document.getElementById('cur-page').innerHTML = this.curPage;

        this.totalSearchData.slice(startIdx, lastIdx).forEach(item => createTotalSearchData(item));
    },
    prevPage() {
        if (this.curPage - 1 < 1) {
            alert("첫번째 페이지 입니다.");
            return;
        }

        this.curPage--;
        /* 기존 검색 데이터들을 모두 지워준다. */
        deleteData("total-search-datas");

        const startIdx = this.paging * (this.curPage - 1);
        const lastIdx = startIdx + this.paging;

        document.getElementById('cur-page').innerHTML = this.curPage;

        this.totalSearchData.slice(startIdx, lastIdx).forEach(item => createTotalSearchData(item));
    }
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
    const showAddr = `${response.location_county} ${response.location_city} ${response.location_district}`;
    resultListAddr.textContent = showAddr;

    const resultListSubject = document.createElement("div");
    resultListSubject.classList.add("result-list-contents-subject");
    resultListSubject.textContent = response.name;
    resultListSubject.style.color = "green";
    resultListSubject.style.fontSize = "20px";

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