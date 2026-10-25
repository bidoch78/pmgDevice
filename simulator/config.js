/********************
 * 
 * EXPORTS
 * YBI 01/10/2026
 * 
 */

const path = require("path");

module.exports = {
    
    port: Number(process.env.PORT || 3002),
    
    webRoot: path.resolve(__dirname, "./web"),

    auth: {
        
    }

};
