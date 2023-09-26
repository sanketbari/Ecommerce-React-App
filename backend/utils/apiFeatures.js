class ApiFeatures{
    constructor(query,queryStr){ 
        this.query = query;
        this.queryStr = queryStr;
        console.log("typeof query: ", typeof this.query);
       
    }

    search(){
        const keyword = this.queryStr.keyword
        ?
        {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",  //case insensitive
            }
        }:{};

        console.log(keyword);

        this.query = this.query.find({...keyword}); 
        return this;
    }

    filter(){
        const copyqueryStr = {...this.queryStr};

        //Removing some fields for category

        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key => delete copyqueryStr[key]);

        //Filter for price and rating
        console.log(copyqueryStr);  //{ price: { gt: '8000', lt: '10000000000000' } }
        let queryStr = JSON.stringify(copyqueryStr);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));

        //below code before implementing Filter on price and rating but we had to append $ sign before gt,lt,lte,lt
        // this.query = this.query.find(copyqueryStr);
        console.log(queryStr); //{"price":{"$gt":"8000","$lt":"10000000000000"}}
        return this;


    }

    pagination(resultPerPage){

        const currentPage = Number(this.queryStr.page) || 1;
        

        let skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;

    }
}

module.exports = ApiFeatures;