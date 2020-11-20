
export function cas2string(casint: number) {
    // the length of cas must be more then or equal 5
    if (casint > 10000) {
        let casstr = casint.toString();
        let l = casstr.length;
        return casstr.substring(0, l - 3) + '-' + casstr.substring(l - 3, l - 1) + '-' + casstr.substring(l - 1);
    }
}