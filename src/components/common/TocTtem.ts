export interface TocItem {
    text: string;
    href: string;
    level: number;
    children?: Array<TocItem>;
}