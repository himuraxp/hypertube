/**
 * View.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id_user:{
      type:"integer",
      required:true,
    },
    id_movie:{
      type:"integer",
      required:true,
    },
    title: {
			type: "string",
			required:true,
		}
  }
};
