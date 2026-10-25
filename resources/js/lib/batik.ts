// ponytail: tile motif batik (SVG data-URI); tambah motif baru sebagai fungsi inner SVG saja
const tile = (inner: string, stroke: string, size: number) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'%3E%3Cg fill='none' stroke='${stroke}' stroke-width='1.5'%3E${inner}%3C/g%3E%3C/svg%3E")`;

const kawung = () =>
    `%3Ccircle cx='36' cy='36' r='10'/%3E%3Cellipse cx='36' cy='14' rx='10' ry='14'/%3E%3Cellipse cx='36' cy='58' rx='10' ry='14'/%3E%3Cellipse cx='14' cy='36' rx='14' ry='10'/%3E%3Cellipse cx='58' cy='36' rx='14' ry='10'/%3E`;

const parang = () =>
    `%3Cpath d='M-12 84 L84 -12'/%3E%3Cpath d='M-12 60 L60 -12'/%3E%3Cpath d='M12 84 L84 12'/%3E`;

const truntum = () =>
    `%3Ccircle cx='14' cy='14' r='3'/%3E%3Ccircle cx='42' cy='14' r='3'/%3E%3Ccircle cx='14' cy='42' r='3'/%3E%3Ccircle cx='42' cy='42' r='3'/%3E%3Cpath d='M28 22 L30 27 L35 29 L30 31 L28 36 L26 31 L21 29 L26 27 Z'/%3E`;

const WHITE = '%23ffffff';
const GREEN = '%232A835F';

/** Kawung: hero + halaman dalam */
export const KAWUNG_LIGHT = tile(kawung(), WHITE, 72);
export const KAWUNG_GREEN = tile(kawung(), GREEN, 72);

/** Parang (diagonal): panel login + CTA */
export const PARANG_LIGHT = tile(parang(), WHITE, 72);
export const PARANG_GREEN = tile(parang(), GREEN, 72);

/** Truntum (dot + bintang): section terang */
export const TRUNTUM_LIGHT = tile(truntum(), WHITE, 56);
export const TRUNTUM_GREEN = tile(truntum(), GREEN, 56);

// ponytail: satu motif per halaman publik; ubah 1 baris di sini untuk ganti motif halaman
type Motif = 'kawung' | 'truntum' | 'parang';

function motifForPage(url: string): Motif {
    if (/^\/(profil|informasi\/(berita|galeri|agenda))/.test(url)) return 'kawung';
    if (/^\/(kontak|formulir|sp4n|pengaduan|permohonan-info|privasi)/.test(url)) return 'parang';

    return 'truntum';
}

const PATTERNS: Record<Motif, { light: string; green: string }> = {
    kawung: { light: KAWUNG_LIGHT, green: KAWUNG_GREEN },
    truntum: { light: TRUNTUM_LIGHT, green: TRUNTUM_GREEN },
    parang: { light: PARANG_LIGHT, green: PARANG_GREEN },
};

export function patternForPage(url: string, variant: 'green' | 'light' = 'green'): string {
    return PATTERNS[motifForPage(url)][variant];
}
