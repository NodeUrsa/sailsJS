define(['backbone'], function (Backbone) {
    "use strict";
	
    var TrxModel = Backbone.Model.extend({
        defaults: {
            id: null,
            fromBranch: null,
            toBranch: null,
            transferNumber: null,
            createDate: null,
            createdBy: null,
            BOL: null,
            BOLDate: null,
            InvAmt: null,
            selected:null
        }
    });
    return TrxModel;
});