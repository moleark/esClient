import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';
import config from 'config';
import { getProducts } from './db';
import { cas2string } from './utils';

const node = config.get<string>('esbaseurl');

const client = new Client({ node: node });

(async () => {

    console.log('start at ' + new Date());

    let pointer: number = 0, endPointer: number = 0;
    let promises: PromiseLike<any>[] = [];
    while (true) {
        let products = await getProducts(pointer, 1);
        if (products && products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let { id, casint } = product;
                if (casint) {
                    let icas = Number.parseInt(casint, 10);
                    if (!isNaN(icas)) {
                        product.cas = cas2string(icas);
                    }
                }
                endPointer = product["id"];
                let { body: exists } = await client.exists({
                    "index": "products",
                    "id": id
                })
                if (!exists) {
                    let doc: RequestParams.Create = {
                        "id": id,
                        "index": "products",
                        "body": JSON.stringify(product)
                    }
                    // create doc 
                    promises.push(client.create(doc));
                }
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
})();