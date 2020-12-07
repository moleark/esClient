
export function cas2string(cas: number | string) {
    // the length of cas must be more then or equal 5
    let casstr: string = '';
    if (typeof cas === 'number' && cas > 10000) {
        casstr = cas.toString();
    }
    if (typeof cas === 'string')
        casstr = cas.replace(/-/g, '');
    let l = casstr.length;
    if (l > 4)
        return casstr.substring(0, l - 3) + '-' + casstr.substring(l - 3, l - 1) + '-' + casstr.substring(l - 1);
}