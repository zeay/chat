var moment = require("moment");
const genrateMessage = (from, text)=>{
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}

const genrateLocationMessage = (from, longitude, latitude)=>{
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}

module.exports = {genrateMessage, genrateLocationMessage};