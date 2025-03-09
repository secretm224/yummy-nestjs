document.addEventListener("DOMContentLoaded", () => {
    console.log("🍽️ 음식점 등록 페이지 로드 완료!");
});

async function registerStore() 
{
    const name = document.getElementById("storeName").value;
    const address = document.getElementById("storeAddress").value;
    const isBeefulPay = document.getElementById("isBeefulPay").checked;

    if (!name || !address) {
        alert("🍕 음식점명과 주소를 입력해주세요!");
        return;
    }

    naver.maps.Service.geocode({ address: address }, function(status, response) {
        if (status !== naver.maps.Service.Status.OK) {
            alert("주소를 찾을 수 없습니다.");
            return;
        }

        let firstItem = response.result.items[0];
        let lat = firstItem.point.y;
        let lng = firstItem.point.x;
        let address = firstItem.address;
        let location_county = firstItem.addrdetail.country;
        let location_city = firstItem.addrdetail.sido; 
        let location_district = firstItem.addrdetail.sigugun;

        if(!!lat && !!lng && !!address){
            let addjson = { 
                            name: name,
                            address:address, 
                            lat: lat, 
                            lng: lng, 
                            type: "store" , 
                            is_beefulpay: isBeefulPay,
                            location_county: location_county,
                            location_city: location_city,
                            location_district: location_district
                        };

            addStore(addjson);
        }else{
            alert('상점을 등록 할수 없습니다.');
            return;
        }
    });
}

async function addStore(store)
{
    try {
    
        const response = await fetch("/store/add", {
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
        console.log(subTypes);
    
    } catch (error) {
        console.error('Error selectMajorType:', error);
    }

}
