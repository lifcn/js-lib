import { CardType } from './card-types';
export default class EoneoPay {
    token: string;
    private apiUrl;
    constructor(token: string, apiUrl?: string);
    private getCardTypeByNumber;
    private luhnCheck;
    private sendRequest;
    getCardTypeByName(name?: string): CardType | undefined;
    getPaySystem(cardNumber: string | number): string;
    validateAccountNumber(accountNumber: string | number): boolean;
    validateAccountName(name: string): boolean;
    validateCardNumber(_cardNumber: string | number): boolean;
    tokeniseCard(data: any): Promise<unknown>;
    tokeniseAccount(data: any): Promise<unknown>;
    getTokenInfo(token: string): Promise<unknown>;
}
