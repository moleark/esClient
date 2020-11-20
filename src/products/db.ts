import { execSql } from '../mysql/tools';

export async function getProducts(pointer: number, salesregion: number) {

    let sql = ` select b.id, b.origin, c.cas as casint, b.description, b.descriptionc, c.mdlnumber, a.hasstock, a.level
                from	product$test.tv_productcache a
                        inner join product$test.tv_productx b on a.$unit = b.$unit and a.product = b.id
                        inner join product$test.\`tv_productchemical\` pc on pc.$unit = b.$unit and pc.product = b.id
                        inner join \`chemical$test\`.tv_chemical c on c.\`$unit\` = pc.\`$unit\` and c.id = pc.chemical
                where   a.$unit = 24 and a.product > ${pointer} and a.salesregion = ${salesregion}
                order by a.product
                limit 20;`;
    let result = await execSql(sql);
    if (result && result.length > 0)
        return result;
}