/**
 * Movie.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title:{
      type: "string",
      required:true,
    },
    year:{
      type:"string",
      required:true,
    },
    note:{
      type:"string",
      required:true,
    },
    poster:{
      type:"string",
      required:true,
    },
    magnet:{
      type:"text",
      required:true,
    },
    resolution:{
      type:"text",
      required:true,
    },
    genre:{
      type:"string",
      required:true,
    },
    path:{
      type:"text",
      defaultsTo: 'path',
    },
    path_vtt:{
      type:"text",
      defaultsTo: 'path',
    },
  }
};
