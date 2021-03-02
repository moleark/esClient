import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';
import config from 'config';
import ParsedArgs from 'minimist';

const node = config.get<string>('esbaseurl');

const client = new Client({ node: node });

(async () => {
    let argv = ParsedArgs(process.argv.slice(2));
    let indexName = "indices." + argv["index"];
    if (config.has(indexName)) {
        const index: RequestParams.IndicesCreate = config.get<RequestParams.IndicesCreate>(indexName)
        await client.indices.create(index);
    }
    else
        console.error(`index: ${indexName} not defined.`);
})();
