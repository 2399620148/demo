/**
 * remote db service
 */
const {dbServer, dbExamServer, appCode} = useRuntimeConfig();

const callApi = async (url, payload) => {
  try{
    const result = await $fetch(url, {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: "APPCODE " + appCode
      }
    });

    if(result && result.data) {
      return result.data
    }
    // console.log(result, 'resultresult')
    return null;
  }catch(err) {
    const {error, status} = err;
    if(error) {
      return error;
    }
    return null;
  }
}

class Chain {
  constructor(serverUrl){ //constructor是一个构造方法，用来接收参数
    this.dbServer = serverUrl;
    return this;
  }

  collection (collectionName) {
    this.collectionName = collectionName;//this代表的是实例对象
    this.conditions = null;
    this.docId = null;
    this.skipNo = 0;
    this.limitNo = 10;
    this.sortObj = null;
    this.populateData = '';
    this.countStatus = false;
    this.fields = null;
    this.showCount = true;
    return this;
  }

  where (conditions) {
    this.conditions = conditions;
    return this;
  }

  doc (docId) {
    this.docId = docId;
    return this;
  }

  skip (no = 0) {
    this.skipNo = no;
    return this;
  }

  sort (obj) {
    this.sortObj = obj;
    return this;
  }

  limit (no = 10) {
    this.limitNo = no;
    return this;
  }

  populate (str) {
    this.populateData = str;
    return this;
  }

  filter (fields) {
    this.fields = fields;
    return this;
  }

  async getOne () {
    return this.get(true)
  }

 // 查询列表，不返回count
  async getList () {
   this.showCount = false;
   return this.get();
  }

  async count () {
    this.countStatus = true;
    return this.get();
  }

  async get (single = false) {
    if(!this.collectionName) return null;
    const payload = {};
    payload.collection = this.collectionName;
    if(this.conditions) {
      payload.where = this.conditions;
    }
    if(this.docId) {
      payload.docId = this.docId;
    }
    if(single) {
      payload.single = true;
    }

    if(this.skip) {
      payload.skip = this.skipNo;
    }

    if(this.sortObj) {
      payload.sort = this.sortObj;
    }

    if(this.limit) {
      payload.limit = this.limitNo;
    }
    if(this.countStatus) {
      payload.count = this.countStatus;
    }

    if(this.populateData) {
      payload.populate = this.populateData;
    }

    if(this.fields) {
      payload.fields = this.fields;
    }

    payload.showCount = this.showCount;
    const result = await callApi(this.dbServer + '/api/getCollectionRecords', payload)
    return result;
  }

  async add ({data}) {
    if(!this.collectionName || !data) return null;
    const payload = {};
    payload.collection = this.collectionName;
    payload.data = data;
    const result = await callApi(this.dbServer + '/api/createCollectionRecords', payload)
    return result;
  }

  async update ({data, multiple = false, renew = true}) {
    const payload = {};
    payload.collection = this.collectionName;
    payload.data = data;
    if(this.conditions) {
      payload.where = this.conditions;
    }
    if(this.docId) {
      payload.docId = this.docId;
    }
    if(multiple) {
      payload.multiple = multiple;
    }
    payload.renew = renew;

    // console.log('dbServer', dbServer)
    // console.log(payload);

    const result = await callApi(this.dbServer + '/api/updateCollectionRecords', payload)
    return result;
  }

  async remove () {
    const payload = {...this.user};
    payload.collection = this.collectionName;
    if(this.conditions) {
      payload.where = this.conditions;
    }
    if(this.docId) {
      payload.docId = this.docId;
    }

    const result = await callApi(this.dbServer + '/api/removeCollectionRecords', payload)
    return result;
  }

  async pipe (conditons) {
    const payload = {};
    payload.collection = this.collectionName;
    const { aggregate, facet} = conditons;
    if(aggregate) {
      payload.aggregate = aggregate;
    }
    if(facet) {
      payload.facet = facet;
    }
    const result = await callApi(this.dbServer + '/api/pipeCollectionRecords', payload)
    return result;
  }

}

export default defineEventHandler((event) => {
  event.context.db = new Chain(dbServer);
  event.context.dbExam = new Chain(dbExamServer);
})