import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
    constructor(private readonly elasticService: ElasticsearchService) {}

    /* 한글 초성 중성 종성 분리 */
    private CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
    private JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
    private JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

    /* **겹받침 조합 규칙 (중성이 두 개 연속될 경우)** */ 
    private DOUBLE_JUNG_MAP: { [key: string]: string } = {
        "ㅗㅏ": "ㅘ", "ㅗㅐ": "ㅙ", "ㅗㅣ": "ㅚ", "ㅜㅓ": "ㅝ",
        "ㅜㅣ": "ㅟ", "ㅡㅣ": "ㅢ"
    };

    /* **겹받침 조합 규칙 (종성이 두 개 연속될 경우)** */ 
    private DOUBLE_JONG_MAP: { [key: string]: string } = {
        "ㄱㅅ": "ㄳ", "ㄴㅈ": "ㄵ", "ㄴㅎ": "ㄶ", "ㄹㄱ": "ㄺ",
        "ㄹㅁ": "ㄻ", "ㄹㅂ": "ㄼ", "ㄹㅅ": "ㄽ", "ㄹㅌ": "ㄾ",
        "ㄹㅍ": "ㄿ", "ㄹㅎ": "ㅀ", "ㅂㅅ": "ㅄ"
    };
    
    private ENG_TO_KOR_MAP: { [key: string]: string } = {
        'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ', 'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
        'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ', 'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
        'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ', 'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ'
    };
    
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

        const sanitizedData = searchData.replace(/[^a-zA-Z0-9가-힣\s]/g, ''); /* 특수문자 제거 */ 
        const convertedChars = searchData.split('').map(char => this.ENG_TO_KOR_MAP[char] || char);
        
        console.log("convertedChars: " + convertedChars.join(''));
    
        let result = "";
        const buffer: string[] = [];
        
        //const completeChar = String.fromCharCode(0xAC00 + (1 * 21 + 2) * 28 + 1);
        //console.log(completeChar);

        let choIndex = -1;
        let jungIndex = -1;
        let jongIndex = 0;
        
        for (let i = 0; i < convertedChars.length; i++) {
            buffer.push(convertedChars[i]);

            if (buffer.length == 1 && this.CHO.includes(buffer[0])) {
                choIndex = this.CHO.indexOf(buffer[0]);
            } else if (buffer.length == 2 && this.JUNG.includes(buffer[1])) {
                const nextIdx = i + 1;
                const twoNextIdx = i + 2;
                const threeNextIdex = i + 3;
                
                jungIndex = this.JUNG.indexOf(buffer[1]);
                
                if (nextIdx < convertedChars.length && this.JUNG.includes(convertedChars[nextIdx])) {
                    /* 겹받침 중성이 존재하는 경우 */ 
                    const combinedString = buffer[1] + convertedChars[nextIdx];
                    const combinedJung = this.DOUBLE_JUNG_MAP[combinedString];
                    jungIndex = this.JUNG.indexOf(combinedJung);

                    if (jungIndex != -1) {
                        i++;

                        if (twoNextIdx < convertedChars.length && this.JONG.includes(convertedChars[twoNextIdx]) && threeNextIdex < convertedChars.length && this.CHO.includes(convertedChars[threeNextIdex])) {
                            /* 겹받침 중성에 종성까지 존재하는 경우 -> 겹받침 중성에는 겹받침 종성은 올 수 없다. */
                            jongIndex = this.JONG.indexOf(convertedChars[twoNextIdx]);
                            i++;
                        }

                        const completeChar = String.fromCharCode(0xAC00 + (choIndex * 21 + jungIndex) * 28 + jongIndex);
                        result += completeChar;
    
                        choIndex = jungIndex = -1;
                        jongIndex = 0;
                        buffer.length = 0; // 버퍼 초기화
                    }
                    
                } else if (nextIdx < convertedChars.length && this.JONG.includes(convertedChars[nextIdx])) {
                    i++;
                    /* 겹받침 종성인지 확인 */
                    if (twoNextIdx < convertedChars.length && this.JONG.includes(convertedChars[twoNextIdx])) {
                        const combinedString = convertedChars[nextIdx] + convertedChars[twoNextIdx];
                        const combinedJong = this.DOUBLE_JONG_MAP[combinedString];
                        jongIndex = this.JONG.indexOf(combinedJong);
                        i++;
                    } 
                    
                    const completeChar = String.fromCharCode(0xAC00 + (choIndex * 21 + jungIndex) * 28 + jongIndex);
                    result += completeChar;
                    
                    choIndex = jungIndex = -1;
                    jongIndex = 0;
                    buffer.length = 0; // 버퍼 초기화
                }
            } else if (buffer.length == 3 && this.JONG.includes(buffer[2])) {
                console.log("test");
            }
        }

        console.log(result);



        // for (const char of convertedChars) {
        //     buffer.push(char);

        //     if (buffer.length == 1 && this.CHO.includes(buffer[0])) {
        //         choIndex = this.CHO.indexOf(buffer[0]);
        //     } else if (buffer.length >= 2) {

        //         if (buffer.length == 2 && this.JUNG.includes(buffer[1])) {

        //         }

        //     }

        //     // if (buffer.length == 1 && this.CHO.includes(buffer[0])) {
        //     //     choIndex = this.CHO.indexOf(buffer[0]);
        //     // } else if (buffer.length == 2 && this.JUNG.includes(buffer[1])) {
        //     //     jungIndex = this.JUNG.indexOf(buffer[1]);
        //     // } else if (buffer.length == 3 && this.JONG.includes(buffer[2])) {

        //     // } else if (buffer.length == 3 && !this.JONG.includes(buffer[2])) {
        //     //     /* 사이즈는 3개이나 종성에서 존재하지 않는 경우 ->  */
                
        //     // }

        // }

        // for (const char of convertedChars) {
        //     buffer.push(char);
        //     console.log("len = " + buffer.length);
            
        //     if (buffer.length >= 2 && this.CHO.includes(buffer[0]) && this.JUNG.includes(buffer[1])) {
        //         const choIndex = this.CHO.indexOf(buffer[0]);
        //         const jungIndex = this.JUNG.indexOf(buffer[1]);
        //         let jongIndex = 0; // 초기에 종성 존재하지 않음.

        //         if (buffer.length >= 3 && this.JONG.includes(buffer[2])) {
        //             // 종성이 있을 경우
        //             jongIndex = this.JONG.indexOf(buffer[2]);
                    
        //             if (jongIndex == -1) {
        //                 jongIndex = 0;
        //                 const completeChar = String.fromCharCode(0xAC00 + (choIndex * 21 + jungIndex) * 28 + jongIndex);
                            
        //                 console.log("completeChar: " + completeChar);
        //                 result += completeChar;
        //             }
        //         }
        //     }
        // }

        //let res = result + buffer.join('');
        //console.log("result: " + result);

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
