import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';
import config from 'config';
import { getProductProductCatalog, getProducts } from './db';
import ParsedArgs from 'minimist';

const node = config.get<string>('esbaseurl');

const client = new Client({ node: node });

(async () => {
    let argv = ParsedArgs(process.argv.slice(2));
    let indexName = "indices." + argv["index"];
    if (config.has(indexName)) {
        switch (argv["index"]) {
            case "products":
                await createProductsDoc();
                break;
            case "productproductcatalog":
                await createCatalogDoc();
                break;
            default:
                console.error('default');
                break;
        }
    }
    else
        console.error(`index: ${indexName} not defined.`);
    process.exit();
})();

async function createProductsDoc() {

    console.log('start at ' + new Date());

    let pointer: number = 0, endPointer: number = 0;
    let promises: PromiseLike<any>[] = [];
    while (true) {
        let products = await getProducts(pointer, 1);
        if (products && products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let { id, brandId, brandName, molecularWeight } = product;
                product.brand = { id: brandId, name: brandName };
                delete product.brandId;
                delete product.brandName;
                if (Number.isNaN(Number.parseFloat(molecularWeight)))
                    product.molecularWeight = undefined;
                else
                    product.molecularWeight = Number.parseFloat(molecularWeight);
                endPointer = product["id"];
                let doc: RequestParams.Index = {
                    id: id,
                    index: "products",
                    body: JSON.stringify(product)
                }
                promises.push(client.index(doc))
            }
            console.log(new Date() + ': begin: ' + pointer + '; end: ' + endPointer + '; number added to es: ' + promises.length);
            if (promises.length > 0) {
                try {
                    await Promise.all(promises);
                    promises.splice(0);
                } catch (error) {
                    console.error(JSON.stringify(error));
                    break;
                }
            }
            pointer = endPointer;
        }
        else {
            break;
        }
    }
    console.log('end at ' + new Date());
};

/**
 * 
 */
async function createCatalogDoc() {

    console.log('start at ' + new Date());

    let pointer: number = 0, endPointer: number = 0;
    let promises: PromiseLike<any>[] = [];
    while (true) {
        let productCatalog = await getProductProductCatalog(pointer, 1);
        if (productCatalog && productCatalog.length > 0) {
            for (let i = 0; i < productCatalog.length; i++) {
                let catalog = productCatalog[i];
                let { id } = catalog;
                endPointer = id;
                let doc: RequestParams.Index = {
                    id: id,
                    index: "productproductcatalog",
                    body: JSON.stringify(catalog)
                }
                promises.push(client.index(doc))
            }
            console.log(new Date() + ': begin: ' + pointer + '; end: ' + endPointer + '; number added to es: ' + promises.length);
            if (promises.length > 0) {
                try {
                    await Promise.all(promises);
                    promises.splice(0);
                } catch (error) {
                    console.error(JSON.stringify(error));
                    break;
                }
            }
            pointer = endPointer;
        }
        else {
            break;
        }
    }
    console.log('end at ' + new Date());
    process.exit();
};