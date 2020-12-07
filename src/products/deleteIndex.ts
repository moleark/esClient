import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';
import config from 'config';

const node = config.get<string>('esbaseurl');

const client = new Client({ node: node });

(async () => {
    const index: RequestParams.IndicesCreate = config.get<RequestParams.IndicesCreate>("indices.products")
    await client.indices.delete({ index: index.index });
})();