class ResponseFormat {
  constructor(res) {
    this.res = res;
    this.data = null;
    this.payload = {};
  }

  success(data = 'OK') {
    this.data = data;
    this.res.status(200);

    return this;
  }

  created(data = 'Créé') {
    this.data = data;
    this.res.status(201);

    return this;
  }

  addPayload(payload) {
    this.payload = payload;

    return this;
  }

  error(data = 'Erreur') {
    this.data = data;
    this.res.status(400);

    return this;
  }

  forbidden(data = 'Accès interdit') {
    this.data = data;
    this.res.status(403);

    return this;
  }

  notFound(data = 'Page introuvable') {
    this.data = data;
    this.res.status(404);

    return this;
  }

  send() {
    let result = {};

    if (typeof this.data === 'string') {
      result = {
        message: this.data
      };
    } else {
      result = this.data;
    }

    result = Object.assign(result, this.payload);

    return this.res.json(result);
  }
}

module.exports = ResponseFormat;
