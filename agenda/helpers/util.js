module.exports = {

    normalizeModel: function (model, schema) {

        var normalizedModel = {};

        for (var key in schema) {
            if (typeof model[key] !== 'undefined') {
                normalizedModel[schema[key]] = model[key];
            }
        }

        return normalizedModel;

    }

};