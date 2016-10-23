/**
 * Comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    contenu:{
      type:"text",
      required:true,
    },
    videos:{
      type:"text",
      required:true,
    },
    idUser: {
       type:"integer",
       required: true,
     },
     pseudoUser:{
       type:"string",
       required:true,
       minLength: 2,
     },
     photoUser:{
       type:"string",
       required:false,
       minLength: 2
     },
  }
};
