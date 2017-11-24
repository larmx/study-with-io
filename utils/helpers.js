const express = require('express');

module.exports={
    group(path, callback){
      const router = express.Router({ mergeParams: true });
      callback(router);
      this.use(path, router);
      return router;
    }
}
