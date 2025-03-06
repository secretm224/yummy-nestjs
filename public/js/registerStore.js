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

        var firstItem = response.result.items[0];
        console.log(firstItem);
        var lat = firstItem.point.y;
        var lng = firstItem.point.x;
        var address = firstItem.address;

        if(!!lat && !!lng && !!address){
            var addjson = { name: name,address:address, lat: lat, lng: lng, type: "store" , is_beefulpay: isBeefulPay};
            addStore(addjson);
        }else{
            alert('상점을 등록 할수 없습니다.');
            return;
        }
    });
}


// function GetGeocode() {
//     var address = document.getElementById("storeAddress").value;
//     var name = document.getElementById("storeName").value;
//     var isBeefulPay = document.getElementById("isBeefulPay").checked;
    
//     if (!address || !name) {
//         alert("🍕 음식점명과 주소를 입력해주세요!");
//         return;
//     }

//     naver.maps.Service.geocode({ address: address }, function(status, response) {
//         if (status !== naver.maps.Service.Status.OK) {
//             alert("주소를 찾을 수 없습니다.");
//             return;
//         }

//         var firstItem = response.result.items[0];
//         var lat = firstItem.point.y;
//         var lng = firstItem.point.x;
//         var address = firstItem.address;

//         if(!!lat && !!lng && !!address){
//             var addjson = { name: name,address:address, lat: lat, lng: lng, type: "store" , is_beefulpay: isBeefulPay};
//             addStore(addjson);
//         }else{
//             alert('상점을 등록 할수 없습니다.');
//             return;
//         }
//     });
// }

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
            SetStores();
        }

    } catch (error) {
        console.error('Error adding store:', error);
    }
}