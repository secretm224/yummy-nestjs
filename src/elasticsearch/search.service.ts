import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
    constructor(private readonly elasticService: ElasticsearchService) {}

    /*
        특정 인덱스의 모든 데이터를 가져오는 함수
    */
    async searchAll<T>(index: string, model: new (data: any) => T): Promise<T[]> {
        const result: SearchResponse<any> = await this.elasticService.search({
            index: index,
            body: {
                query: {
                    match_all: {}
                },
                size: 10000
            }
        });

        return result.hits.hits.map(hit => new model({
            ...hit._source, 
            timestamp: hit._source.timestamp ? new Date(hit._source.timestamp) : undefined
        }));
    }

    /* 문자열 변환 함수 */
    stringTranformationFunction(searchData: string): string {

        /* 한글 초성 중성 종성 분리 */
        const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
        const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
        const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

        // **겹받침 조합 규칙 (종성이 두 개 연속될 경우)**
        const DOUBLE_JONG_MAP: { [key: string]: string } = {
            "ㄱㅅ": "ㄳ", "ㄴㅈ": "ㄵ", "ㄴㅎ": "ㄶ", "ㄹㄱ": "ㄺ",
            "ㄹㅁ": "ㄻ", "ㄹㅂ": "ㄼ", "ㄹㅅ": "ㄽ", "ㄹㅌ": "ㄾ",
            "ㄹㅍ": "ㄿ", "ㄹㅎ": "ㅀ", "ㅂㅅ": "ㅄ"
        };

        const ENG_TO_KOR_MAP: { [key: string]: string } = {
            'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ', 'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
            'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ', 'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
            'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ', 'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ'
          };
        
        /* 특수문자 제거 */ 
        const sanitizedData = searchData.replace(/[^a-zA-Z0-9가-힣\s]/g, '');
        const convertedChars = searchData.split('').map(char => ENG_TO_KOR_MAP[char] || char);
        
        console.log("convertedChars: " + convertedChars);
    
        let result = "";
        let buffer: string[] = [];

        for (let char of convertedChars) {
            buffer.push(char);
            console.log("len = " + buffer.length);

            if (buffer.length >= 2 && CHO.includes(buffer[0]) && JUNG.includes(buffer[1])) {
                let choIndex = CHO.indexOf(buffer[0]);
                let jungIndex = JUNG.indexOf(buffer[1]);
                let jongIndex = 0; // 초기에 종성 존재하지 않음.

                if (buffer.length >= 3 && JONG.includes(buffer[2])) {
                    // 종성이 있을 경우
                    jongIndex = JONG.indexOf(buffer[2]);

                    if (jongIndex == -1) {
                        jongIndex = 0;
                        let completeChar = String.fromCharCode(0xAC00 + (choIndex * 21 + jungIndex) * 28 + jongIndex);
                            
                        console.log("completeChar: " + completeChar);
                        result += completeChar;
                    }
                }
            }
        }

        //let res = result + buffer.join('');
        console.log("result: " + result);

        // 의미없는 단어 한글변환
        //const convEngToKor = searchData.split('').map(char => ENG_TO_KOR_MAP[char] || char).join('');

        //console.log(convEngToKor)
        
        return sanitizedData;
    }


    async searchStoreDate<T>(index: string, searchData: string, model: new (data: any) => T): Promise<T[]> {
        const result: SearchResponse<any> = await this.elasticService.search({
            index: index,
            body: {
                query: {
                    
                },  
                size: 10000
            }
        }); 


        return result.hits.hits.map(hit => new model({
            ...hit._source, 
            timestamp: hit._source.timestamp ? new Date(hit._source.timestamp) : undefined
        }));
    }
}
