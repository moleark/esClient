import { execSql } from '../mysql/tools';
import config from 'config';

export async function getProducts(pointer: number, salesregion: number) {

    let sql = config.get<string[]>("sqls.products").join(' ');
    let result = await execSql(sql, [pointer, salesregion]);
    if (result && result.length > 0)
        return result;
}

export async function getProductProductCatalog(pointer: number, salesregion: number) {

    let sql = config.get<string[]>("sqls.productproductcatalog").join(" ");
    let result = await execSql(sql, [salesregion, pointer]);
    if (result && result.length > 0)
        return result;
}

export async function getProductStandardSample(pointer: number, salesregion: number) {

    let sql = config.get<string[]>("sqls.productstandardsample").join(" ");
    let result = await execSql(sql, [pointer]);
    if (result && result.length > 0)
        return result;
}