const { Client } = require('@elastic/elasticsearch');
const client = new Client({node: 'http://localhost:9200'});

client.search({
	index: 'my-index',
	body: {
		query: {
			match: { hello: 'world' }
		}
	}
},(err, result)=>{
	console.log(JSON.stringify(result));
})
