import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { SearchTransformDTO } from './dto/SearchTransformDTO';

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
        /* 첫 번째 행 */ 
        'q': 'ㅂ',  'w': 'ㅈ',  'e': 'ㄷ',  'r': 'ㄱ',  't': 'ㅅ',
        'y': 'ㅛ',  'u': 'ㅕ',  'i': 'ㅑ',  'o': 'ㅐ',  'p': 'ㅔ',
        'Q': 'ㅃ',  'W': 'ㅉ',  'E': 'ㄸ',  'R': 'ㄲ',  'T': 'ㅆ',
        'Y': 'ㅛ',  'U': 'ㅕ',  'I': 'ㅑ',  'O': 'ㅐ',  'P': 'ㅔ',
        /* 두 번째 행 */ 
        'a': 'ㅁ',  's': 'ㄴ',  'd': 'ㅇ',  'f': 'ㄹ',  'g': 'ㅎ',
        'h': 'ㅗ',  'j': 'ㅓ',  'k': 'ㅏ',  'l': 'ㅣ',
        'A': 'ㅁ',  'S': 'ㄴ',  'D': 'ㅇ',  'F': 'ㄹ',  'G': 'ㅎ',
        'H': 'ㅗ',  'J': 'ㅓ',  'K': 'ㅏ',  'L': 'ㅣ',
        /* 세 번째 행 */ 
        'z': 'ㅋ',  'x': 'ㅌ',  'c': 'ㅊ',  'v': 'ㅍ',  'b': 'ㅠ',  'n': 'ㅜ',  'm': 'ㅡ',
        'Z': 'ㅋ',  'X': 'ㅌ',  'C': 'ㅊ',  'V': 'ㅍ',  'B': 'ㅠ',  'N': 'ㅜ',  'M': 'ㅡ'
    };
    

    /* 문자열 변환 함수 */
    stringTranformationFunction(searchData: string): SearchTransformDTO {
        
        /* 특수문자 제거 후 리스트로 변환 */ 
        const sanitizedData = searchData.replace(/[^a-zA-Z0-9가-힣\s]/g, '').split(''); 
        
        /* 모두 영문자인지 확인해준다. */
        const allEngYn = /^[A-Za-z]+$/.test(searchData);

        if (allEngYn) {

            /* 영문자를 한글로 치환해준다. */
            const jamos: string[] = sanitizedData.map(ch => {
                return this.ENG_TO_KOR_MAP[ch] || ch;
            });
            
            /* 음절 결합 로직 */
            let result = "";
            let idx = 0;

            while (idx < jamos.length) {
                /* 1. 초성 처리 */ 
                const initial = jamos[idx];

                if (!this.CHO.includes(initial)) {
                    result += initial;
                    idx++;
                    continue;
                }
                
                idx++;
                
                /* 2. 중성 처리 (필수) */ 
                if (idx >= jamos.length || !this.JUNG.includes(jamos[idx])) {
                    /* 중성이 없으면 초성만 추가 */ 
                    result += initial;
                    continue;
                }
                let medial = jamos[idx];
                idx++;

                /* 2-1. 겹모음 처리: 중성과 다음 자모 결합 */ 
                if (idx < jamos.length) {
                    const possibleDouble = medial + jamos[idx];
                    if (this.DOUBLE_JUNG_MAP[possibleDouble]) {
                        medial = this.DOUBLE_JUNG_MAP[possibleDouble];
                        idx++;
                    }
                }

                /* 3. 종성 처리 (선택적) */ 
                let finalConsonant = "";

                /* 만약 다음 자모가 존재하고, 그것이 종성 후보라면 */ 
                if (idx < jamos.length && this.JONG.includes(jamos[idx])) {
                    /* 
                        Lookahead: 만약 그 다음 자모가 존재하고 중성(모음)이라면, 현재 자모를 종성으로 사용하지 않고 다음 음절의 초성으로 넘긴다.
                    */
                    if (idx + 1 < jamos.length && this.JUNG.includes(jamos[idx + 1])) {
                        // Do nothing; finalConsonant remains ""
                    } else {
                        finalConsonant = jamos[idx];
                        idx++;
                        /* 겹받침 처리: 다음 자모와 결합 가능한 경우 */ 
                        if (idx < jamos.length && this.JONG.includes(jamos[idx])) {
                        const possibleDoubleFinal = finalConsonant + jamos[idx];
                        if (this.DOUBLE_JONG_MAP[possibleDoubleFinal]) {
                            finalConsonant = this.DOUBLE_JONG_MAP[possibleDoubleFinal];
                            idx++;
                        }
                        }
                    }
                }

                /* 4. 완성형 한글 조합 (유니코드 공식 사용) */ 
                const choIndex = this.CHO.indexOf(initial);
                const jungIndex = this.JUNG.indexOf(medial);
                const jongIndex = this.JONG.indexOf(finalConsonant);
                const syllableCode = 0xAC00 + (choIndex * 21 + jungIndex) * 28 + (jongIndex > -1 ? jongIndex : 0);
                result += String.fromCharCode(syllableCode);
            }
            
            return new SearchTransformDTO(searchData, result);
        } else {
            return new SearchTransformDTO(searchData, "");
        }
    }


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

    /*
            
    */
    async searchAutoCompleteDatas<T>(index: string, searchDto: SearchTransformDTO, model: new (data: any) => T): Promise<T[]> {
        
        const searchData = searchDto.searchData;
        const searchTrnansData = searchDto.searchDataTrans;
    

        /* 기본 Should 쿼리 */
        const shouldQueries = [
            { match: { name: { query: searchData, boost: 2.0 } } },
            { match: { address: { query: searchData, boost: 1.5 } } },
        ];

        /* searchTrnansData가 빈 문자열이 아니라면 추가 쿼리 삽입 */ 
        if (searchTrnansData !== "") {
            shouldQueries.push(
                { match: { name: { query: searchTrnansData, boost: 2.0 } } },
                { match: { address: { query: searchTrnansData, boost: 1.5 } } }
            );
        }

        const result: SearchResponse<any> = await this.elasticService.search({
            index: index,
            body: {
                query: {
                    bool: {
                      should: shouldQueries,
                      minimum_should_match: 1
                    }
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
