import { CardType } from './card-types';
export default class EoneoPay {
    token: string;
    private apiUrl;
    constructor(token: string);
    private getCardTypeByNumber;
    getCardTypeByName(name?: string): CardType | undefined;
    getPaySystem(cardNumber: string | number): string;
    validateAccountNumber(accountNumber: string | number): boolean;
    validateAccountName(name: string): boolean;
    validateCardNumber(_cardNumber: string | number): boolean;
    luhnCheck(cardNumber: string): boolean;
    sendRequest(type: string | undefined, endpoint: string, data?: any): Promise<unknown>;
    tokeniseCard(data: any): Promise<unknown>;
    tokeniseAccount(data: any): Promise<unknown>;
    getTokenInfo(token: string): Promise<unknown>;
}
