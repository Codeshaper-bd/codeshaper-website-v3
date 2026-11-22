/* eslint-disable @typescript-eslint/no-explicit-any */
export function simpleSections(html: string): { heading: string; paragraphs: string[] }[] | null;
export function headingsOf(html: string): { id: string; text: string }[];
export function toSite(raw: any, warn?: (message: string) => void): any;
export function checkSite(site: any): string[];
