export interface TocItem {
    text: string;
    href: string;
    level: number;
    name: string;
    children?: Array<TocItem>;
}