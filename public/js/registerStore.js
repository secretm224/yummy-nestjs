document.addEventListener('DOMContentLoaded', async () => {
    const selectElement = document.getElementById('majorTypeSelect');

    try {
        
        /* Java 백엔드 API 호출 - 음식점 대분류 데이터 가져옴 */
        const response = await fetch(`${window.env.api_base_url}/stores/getTypeMajor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        /* API 응답 데이터를 JSON 형식으로 파싱 */ 
        const majorTypes = await response.json();

        /* 응답 데이터를 <select> 옵션으로 추가 */ 
        majorTypes.forEach(data => {
            const option = document.createElement('option');
            option.value = data.majorType;
            option.textContent = data.typeName;
            selectElement.appendChild(option);
        });
        

    } catch(err) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
    }
});

/**
 * 상점을 등록해주는 함수
 * 
 * @returns 
 */
async function registerStore() 
{
    const name = document.getElementById("storeName").value;
    const address = document.getElementById("storeAddress").value;
    const isBeefulPay = document.getElementById("isBeefulPay").checked;
    const majorType = document.getElementById("majorTypeSelect")?.value || 0;
    const subType = document.getElementById("subTypeSelect")?.value || 0;

    if (!name || !address) {
        alert("🍕 음식점명과 주소를 입력해주세요!");
        return;
    }

    if (majorType == 0 || subType == 0) {
        alert("📌 음식점의 대분류/소분류를 지정해주세요!");
        return;
    }

    try {   
        naver.maps.Service.geocode({ address: address }, function(status, response) {
            
            let firstItem = response.result.items[0];

            if (status !== naver.maps.Service.Status.OK || firstItem == null) {
                alert("주소를 찾을 수 없습니다.");
                return;
            }
            
            let lat = firstItem.point.y;
            let lng = firstItem.point.x;
            let address = firstItem.address;
            let location_county = firstItem.addrdetail.sido;
            let location_city = firstItem.addrdetail.sigugun; 
            let location_district = firstItem.addrdetail.dongmyun;

            //console.log(firstItem);

            if (!!lat && !!lng && !!address) {
                let addjson = { 
                    name: name,
                    address:address, 
                    lat: lat, 
                    lng: lng, 
                    type: "store" , 
                    is_beefulpay: isBeefulPay,
                    location_county: location_county,
                    location_city: location_city,
                    location_district: location_district,
                    sub_type: subType 
                };
    
                addStore(addjson);
            } else {
                alert('상점을 등록 할수 없습니다.');
                return;
            }
        });

    } catch(err) {
        alert("🚧 정확한 주소를 적어주세요");
    }
}

async function addStore(store)
{
    try {
        
        const response = await fetch(`${window.env.api_base_url}/stores/addStore`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(store),
        });

        const result = await response.json();

        if(!!result){
            alert("🍕 음식점이 등록되었습니다.");
        }else{
            alert("🍕 음식점 등록에 실패했습니다");
        }

    } catch (error) {
        console.error('Error adding store:', error);
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

        const response = await fetch(`${window.env.api_base_url}/stores/getTypeSub?majorType=${majorType}`, {
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

    /* 기존 소분류 선택 영역이 있으면 삭제 */ 
    let subTypeContainer = document.getElementById("subTypeContainer");
    if (subTypeContainer) {
        subTypeContainer.remove();
    }

    /* 새로운 div 생성 */ 
    subTypeContainer = document.createElement("div");
    subTypeContainer.id = "subTypeContainer";
    subTypeContainer.classList.add("custom-select");

    /* 새로운 <label> 생성 */ 
    const label = document.createElement("label");
    label.setAttribute("for", "subTypeSelect");
    label.innerText = "⚙️ 음식점 소분류";

    /* 새로운 <select> 생성 */ 
    const select = document.createElement("select");
    select.id = "subTypeSelect";

    /* 기본 옵션 추가 */ 
    const defaultOption = document.createElement("option");
    defaultOption.value = "0";
    defaultOption.innerText = "분류를 선택하세요.";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    /* 서버에서 받은 소분류 데이터를 기반으로 옵션 추가 */
    subTypes.forEach(subType => {
        const option = document.createElement("option");
        option.value = subType.subType;
        option.innerText = subType.typeName;
        select.appendChild(option);
    });

    /* 생성한 요소를 DOM에 추가 */ 
    subTypeContainer.appendChild(label);
    subTypeContainer.appendChild(select);

    /* 기존 소분류 선택박스 영역을 갱신 */ 
    const majorTypeSelect = document.getElementById("majorTypeSelect");
    majorTypeSelect.parentNode.after(subTypeContainer);
}
