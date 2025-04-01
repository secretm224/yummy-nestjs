
document.addEventListener('DOMContentLoaded', async () => {
    const selectElement = document.getElementById('select-county');

    try {
        
        /* Java 백엔드 API 호출 - 전체 시/도 가져옴 */
        const response = await fetch(`${window.env.api_base_url}/location/county`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        /* API 응답 데이터를 JSON 형식으로 파싱 */ 
        const counties = await response.json();

        /* 응답 데이터를 <select> 옵션으로 추가 */ 
        counties.forEach(data => {
            const option = document.createElement('option');
            option.value = data.locationCountyCode;
            option.textContent = data.locationCounty;
            selectElement.appendChild(option);
        });
        
    } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
    }
});

document.getElementById("searchInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();     /* 기본 동작 방지 */ 
        SearchManager.toalSearch(); /* 검색 실행 */ 
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
        const zeroPayYn = document.getElementsByName("zero-pay-option")[0].checked;

        try {

            /* JAVA REST-API */
            const response = await fetch(`${window.env.api_base_url}/search/totalSearch?searchText=${searchValue}&selectMajor=${selectMajor}&selectSub=${selectSub}&zeroPossible=${zeroPayYn}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
    
            if (!response.ok) {
                throw new Error("서버 요청 실패");
            }
    
            this.totalSearchData = []; // 검색결과 초기화

            /* 현재 페이지 숫자 초기화 */
            this.curPage = 1;
            document.getElementById('cur-page').innerHTML = this.curPage;
            
            const responseData = await response.json(); // 검색결과 json 파싱
            responseData.forEach(item => this.totalSearchData.push(item)); // 검색결과 통합검색 데이터 배열에 추가
            

            document.getElementsByClassName("find-store-title").textContent = '총 <span style="color: red;" id="find-store-title-value">' + this.totalSearchData.length + '</span>개의 음식점을 찾았습니다.';
            
            /* 페이징 처리 */
            let totalPage = Math.floor(this.totalSearchData.length / this.paging);
            const remainderPage = this.totalSearchData.length % this.paging;
            
            if (remainderPage > 0) {
                totalPage++;
            }
            
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

    /* 콘텐츠 컨테이너에 주소 & 제목 추가 */ 
    resultListContents.appendChild(resultListAddr);
    resultListContents.appendChild(resultListSubject);

    /* 최상위 컨테이너에 요소 추가 */ 
    resultListWrapper.appendChild(resultListImg);
    resultListWrapper.appendChild(resultListContents);
    resultListWrapper.appendChild(resultListStar);
    
    parentElement.appendChild(resultListWrapper);
}

/**
 * 시,도 를 선택해줬을때 해당 구,군 을 가져오는 함수
 * @param {*} county 
 */
async function selectCounty(county) {

    try {

        const response = await fetch(`${window.env.api_base_url}/location/city?countySeq=${county}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const subTypes = await response.json();
        updateCityLocationSelect(subTypes);
    
    } catch (error) {
        console.error('Error selectMajorType:', error);
    }
}

function updateCityLocationSelect(updateData) {

    const selectElement = document.getElementById('select-city');
    selectElement.innerHTML = '<option value="0" selected>전체</option>';

    updateData.forEach(data => {
        const option = document.createElement('option');
        option.value = data.locationCityCode;
        option.textContent = data.locationCity;
        selectElement.appendChild(option);
    });
}