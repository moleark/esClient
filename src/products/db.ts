import { execSql } from '../mysql/tools';
import config from 'config';

const dbProduct = config.get<string>("database.product");
const dbChemical = config.get<string>("database.chemical");
const indexBatchSize = config.get<number>("index_batch_size");

export async function getProducts(pointer: number, salesregion: number) {

        let sql = ` select b.id, bd.id as brandId, bd.name as brandName, b.origin, pc.cas, b.description, b.descriptionc, c.mdlnumber
            , pc.purity, pc.molecularfomula, pc.molecularweight, pc.chemical, a.salesregion, a.hasstock, a.level, b.no
            from	\`${dbProduct}\`.tv_productcache a
                    inner join \`${dbProduct}\`.tv_productx b on a.$unit = b.$unit and a.product = b.id
                    inner join \`${dbProduct}\`.\`tv_productchemical\` pc on pc.$unit = b.$unit and pc.product = b.id
                    inner join \`${dbChemical}\`.tv_chemical c on c.\`$unit\` = pc.\`$unit\` and c.id = pc.chemical
                    inner join \`${dbProduct}\`.tv_brand bd on bd.$unit = b.$unit and bd.id = b.brand
            where   a.$unit = 24 and a.product > ${pointer} and a.salesregion = ${salesregion}
            order by a.product
            limit ${indexBatchSize};`;
        let result = await execSql(sql);
        if (result && result.length > 0)
                return result;
}