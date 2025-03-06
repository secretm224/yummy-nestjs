var zeroPayStores = [{ name: "알바천국", lat: 37.5032355765545, lng: 127.046582379785, type: "company" }];
    let zeroPayMarkers = [];
    let map;
    let userLat = null;
    let userLng = null;
    let markers = [];

   window.onload = SetStores;

    function SetMap() {
        map = new naver.maps.Map('map', {
            center: new naver.maps.LatLng(37.5045028775835, 127.048942471228),
            zoom: 17
        });

       var storeIcon = "https://cdn-icons-png.flaticon.com/128/3170/3170733.png"; // 음식점 아이콘
       var companyIcon = "public/alba.png"; // 회사 아이콘
       var beefulPayIcon = "public/pay.png"; // ✅ 비플페이 가맹점 아이콘


       var referenceStore = zeroPayStores.find(store => store.name === "알바천국");

      zeroPayStores.forEach(function(store) {
             var iconUrl = store.isBeefulPay ? beefulPayIcon : (store.type === "company" ? companyIcon : storeIcon);

            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(store.lat, store.lng),
                map: map,
                icon: {
                    url: iconUrl,
                    size: new naver.maps.Size(30, 30),
                    scaledSize: new naver.maps.Size(30, 30),
                    origin: new naver.maps.Point(0, 0),
                    anchor: new naver.maps.Point(20, 40)
                },
                draggable: false
            });

            markers.push(marker);

            if(isIOS()){

                setTimeout(() => {
                    let markerElement = marker.getElement();
                    if (markerElement) {
                        markerElement.style.pointerEvents = "auto";
                        markerElement.style.touchAction = "manipulation"; // 터치 충돌 방지
                        markerElement.style.cursor = "pointer"; // 터치 가능하도록 UI 개선

                        // ✅ 마커 주변 터치도 가능하도록 `hitArea` 확장
                        let hitArea = document.createElement("div");
                        hitArea.style.position = "absolute";
                        hitArea.style.width = "50px"; // 기존 크기보다 약간 더 큼
                        hitArea.style.height = "50px";
                        hitArea.style.top = "-25px"; // 마커 중앙을 기준으로 조정
                        hitArea.style.left = "-25px";
                        hitArea.style.backgroundColor = "transparent";
                        hitArea.style.pointerEvents = "auto";

                        markerElement.appendChild(hitArea);

                    }
                }, 500);

                function handleMarkerClick() {
                    selectMarker(marker, store.name);
                }

                naver.maps.Event.addListener(marker, "click", handleMarkerClick);
                naver.maps.Event.addListener(marker, "touchstart", handleMarkerClick);
                naver.maps.Event.addListener(marker, "touchend", handleMarkerClick);
            }

            zeroPayMarkers.push({ storeName: store.name, marker: marker });
            
            // 가게 타입별 이모지 설정 (귀여운 요소 추가)
            var emoji = "🍽️"; // 기본 음식점
            if (store.name.includes("커피") || store.name.includes("카페") || store.name.includes("스타벅스")) {
                emoji = "☕";
            } else if (store.name.includes("치킨") || store.name.includes("BBQ")) {
                emoji = "🍗";
            } else if (store.name.includes("햄버거") || store.name.includes("버거")|| store.name.includes("맘스터치")) {
                emoji = "🍔";
            } else if (store.type === "company") {
                emoji = "🏢"; // 회사 아이콘
            }
            //moon
           const directionsUrl = `https://map.naver.com/v5/search/${store.name}?c=${store.lng},${store.lat},17,0,0,0,dh`;
           var beefulPayTag = store.isBeefulPay ? `<div style="color: green; font-weight: bold;">💳 비플페이 가맹점</div>` : "";
           var infowindow = new naver.maps.InfoWindow({
                content: `
                    <div style="
                        padding: 10px; 
                        border-radius: 10px; 
                        background-color: #FFF8DC; 
                        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); 
                        text-align: center;
                        font-family: 'Comic Sans MS', sans-serif;
                        max-width: 200px;
                    ">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
                            ${emoji} ${store.name}
                        </div>
                        ${beefulPayTag} <!-- ✅ 비플페이 가맹점 여부 표시 -->
                        <div id="walking-time-${store.name}" style="font-size: 14px; color: #555;"></div>
                        <a href="${directionsUrl}" target="_blank" style="
                            display: inline-block;
                            padding: 5px 10px;
                            font-size: 14px;
                            color: white;
                            background-color: #FF8C00;
                            border-radius: 5px;
                            text-decoration: none;
                            font-weight: bold;
                        ">🗺️ 네이버 지도에서 보기</a>
                    </div>`
            });

            //카리나님 요청사항 적용
            // naver.maps.Event.addListener(marker, "dragend", function(e) {
            //     if(confirm("위치를 수정하시겠습니까?") == true){
            //         var lat = e.coord.y;
            //         var lng = e.coord.x;
            //         //document.getElementById("markerInfo").innerHTML = `📍 ${store.name} 이동됨:<br> 위도: ${lat}<br> 경도: ${lng}`;
            //         var store_json = { name: store.name, lat: lat, lng: lng, type: "store" };

            //         updatecoords(store_json);
            //     }
            // });

            naver.maps.Event.addListener(marker, "click", function() {
                if (infowindow.getMap()) {
                    infowindow.close();
                } else {
                    infowindow.open(map, marker);

                     // 📏 기준 마커와의 도보 이동 시간 계산
                    if (referenceStore) {
                        var distance = getDistance(store.lat, store.lng, referenceStore.lat, referenceStore.lng);
                        var walkingTime = getWalkingTime(distance);
                        document.getElementById(`walking-time-${store.name}`).innerHTML = `🚶‍♂️ 도보 시간: <b>${walkingTime}분</b>`;
                    }
                }
            });
        });

        var htmltag1 = `<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/public/cluster-marker-1.png);background-size:contain;"></div>`;
        var htmltag2 = `<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/public/cluster-marker-2.png);background-size:contain;"></div>`;
        var htmltag3 = `<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/public/cluster-marker-3.png);background-size:contain;"></div>`;
        var htmltag4 = `<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/public/cluster-marker-4.png);background-size:contain;"></div>`;
        var htmltag5 = `<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/public/cluster-marker-5.png);background-size:contain;"></div>`;

        var htmlMarker1 = {
            content: htmltag1,
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker2 = {
            content: htmltag2,
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker3 = {
            content: htmltag3,
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker4 = {
            content: htmltag4,
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker5 = {
            content: htmltag5,
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        };

//        console.log(htmlMarker5);

        var clusterer = new MarkerClustering({
            minClusterSize: 2,  
            maxZoom: 16,  
            map: map,  
            markers: markers, 
            disableClickZoom: false,  // 클러스터 클릭 시 확대 여부
            gridSize: 100,  // 클러스터 범위
            icons: [htmlMarker1,htmlMarker2,htmlMarker3,htmlMarker4,htmlMarker5],
            indexGenerator: [10, 100, 200, 500, 1000],
            
             stylingFunction: function(clusterMarker, count) {
                console.log(clusterMarker.getElement());
                console.log(clusterMarker);
                console.log(count);
                $(clusterMarker.getElement()).find('div:first-child').text(count);
            }
        });

    }

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // 마커 선택 함수 (zIndex 변경으로 선택 강조)
    function selectMarker(marker, storeName) {
        marker.setZIndex(200); // 선택된 마커를 맨 위로
    }
    
    function GetGeocode() {
        var address = document.getElementById("storeAddress").value;
        var name = document.getElementById("storeName").value;
        var isBeefulPay = document.getElementById("isBeefulPay").checked;
        
        if (!address || !name) {
            alert("🍕 음식점명과 주소를 입력해주세요!");
            return;
        }

        naver.maps.Service.geocode({ address: address }, function(status, response) {
            if (status !== naver.maps.Service.Status.OK) {
                alert("주소를 찾을 수 없습니다.");
                return;
            }

            var firstItem = response.result.items[0];
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

    //📏 거리 계산 함수 (Haversine Formula)
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // 지구 반지름 (km)
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2); // km 단위 거리 반환 (소수점 2자리)
    }

    // 🚶‍♂️ 도보 이동 시간 계산 함수
    function getWalkingTime(distanceKm) {
        const walkingSpeedKmPerHour = 3.5; // 평균 도보 속도 (4.8 km/h)
        const timeMinutes = (distanceKm / walkingSpeedKmPerHour) * 60;
        return Math.ceil(timeMinutes); // 소수점 올림 (정수값 반환)
    }

    async function SetStores() 
    {
        zeroPayStores = [{ name: "알바천국", lat: 37.5032355765545, lng: 127.046582379785, type: "company" }];

        try {
            
            /* Elasticsearch 에서 Store 데이터를 가져오는 방식 */
            const response = await fetch(`/search/allData`, {
                method: 'GET',
                headers: {
                    'yummy-key': 'zkflsk123',
                    'Content-Type': 'application/json'
                }
            });

            //const response = await fetch('/store/all'); -> ORM 방식: DB 에서 가져오는 방식
            const stores = await response.json();

            stores.forEach(store => {
                //const is_beefulpay = store.name === "우리집 만두" ? false : true; -> TEST CODE
                // 비플페이 가맹점과 아닌 가맹점을 나누기 위함.
                zeroPayStores.push({
                    name: store.name,
                    lat: store.lat,
                    lng: store.lng,
                    type: store.type,
                    isBeefulPay: store.zero_possible
                });
            });
            
            //console.log(zeroPayStores);
            if(zeroPayStores.length <=0){
                alert("등록된 가게가 없습니다.");
            }
            
            StoreList(zeroPayStores);
            SetMap();

        } catch (error) {
            console.error('Error fetching store data:', error);
            alert('Error fetching store data:', error);
        }
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
                SetStores();
            }

        } catch (error) {
            console.error('Error adding store:', error);
        }
    }


    async function updatecoords(store)
    {
        try {
        
            const response = await fetch("/store/update", {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(store),
                                });

            const result = await response.json();

            if(!!result){
                alert("🍕 위치가 수정되었습니다.");
                SetStores();
            }

        } catch (error) {
            console.error('Error updating store:', error);
        }
    }

    async function StoreList(zeroPayStores) {
       
        const storeList = document.getElementById('store-items');
        storeList.innerHTML = '';

        zeroPayStores.forEach((store) => {

            if(store.type === "company") return;

            const listItem = document.createElement('li');
            const payType = store.isBeefulPay ? "💳" : "";
            const storename =  !!payType ? `${'['+payType+']  '+store.name}`: store.name;
            listItem.textContent = storename;

            
            // 클릭 이벤트 추가
            listItem.addEventListener('click', function() {
                const markerData = zeroPayMarkers.find(item => item.storeName === store.name);
                if (markerData) {
                    naver.maps.Event.trigger(markerData.marker, 'click');
                }
            });

            storeList.appendChild(listItem);
        });
    }

    // 토글 기능
    function toggleStoreList() {
        // const storeList = document.getElementById('store-list');
        // storeList.classList.toggle('active');
        const storeListContainer = document.getElementById('store-list-container');
        const storeList = document.getElementById('store-list');
    
        if (storeList.style.display === "block") {
            storeList.style.display = "none";
        } else {
            storeList.style.display = "block";
        }
    }

   function recommendRandomStore() {
        let storeNames = zeroPayStores.filter(store => store.type !== 'company');
        if (storeNames.length === 0) {
            alert("등록된 맛집이 없습니다!");
            return;
        }

        let randomIndex = Math.floor(Math.random() * storeNames.length);
        let winningStore = storeNames[randomIndex];

        let recommendationDiv = document.getElementById("recommendation");
        recommendationDiv.innerHTML = `🎉 ${winningStore.name}!`;
        recommendationDiv.style.display = "block";

        setTimeout(() => {
            recommendationDiv.style.display = "none";
        }, 3000);

        let winningMarker = zeroPayMarkers.find(item => item.storeName === winningStore.name);
        if (winningMarker) {
            naver.maps.Event.trigger(winningMarker.marker, 'click');
            map.setZoom(18);
            map.setCenter(winningMarker.marker.getPosition());
        }
    }

    function resetMap() {
        map.setCenter(new naver.maps.LatLng(37.5045, 127.0489));
        map.setZoom(17);
        map.closeInfoWindow();
    }

    