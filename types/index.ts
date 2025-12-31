export type Platform = 'google' | 'shodan' | 'zoomeye' | 'censys' | 'fofa';

export interface SearchParameters {
    target: string;
    infoType: string;
    filters: string; // Comma separated or free text for now
    exclusions: string;
}

export interface DorkResponse {
    dorks: string; // Raw text from Claude for now, or parsed JSON later
}
